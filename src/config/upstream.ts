import { createHash } from "node:crypto";
import { canRequest, recordFailure, recordSuccess } from "@/lib/circuit-breaker";
import { incrementMetric, observeHistogram } from "@/lib/metrics";
import { redisGet, redisSet } from "@/lib/redis";
import { SCRAPE_BASE_URL } from "@/services/scraper/constants";

const MAX_RETRIES = 2;
const RETRY_BASE_MS = 500;
const TIMEOUT_MS = 10_000;
const MAX_CONTENT_BYTES = 10 * 1024 * 1024;
const VALIDATOR_TTL_SECONDS = 6 * 60 * 60;

// Single upstream host — one breaker guards it. Consumed by /api/ready.
export const UPSTREAM_CIRCUIT_KEY = "kusonime-upstream";

// Error shape matching what the old axios-based consumers read: `code` plus an
// axios-like `response` object for status/data inspection.
export interface UpstreamErrorLike {
  code?: string;
  response?: { status?: number; data?: unknown; headers?: Record<string, string> };
}

interface UpstreamRequestConfig {
  headers?: Record<string, string>;
  timeoutMs?: number;
}

interface UpstreamResponse {
  data: string;
  status: number;
  headers: Record<string, string>;
  request: { responseURL: string };
  config: { url: string };
}

// Faithful restore of the last known-good direct-scrape config (7e34949,
// Aug 9): withCredentials, bare "*" UA, Host header, one fresh request per
// attempt. The keep-alive agents added in 1181759 reused challenged sockets
// and never validated.
const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/x-www-form-urlencoded",
  Accept: "application/json, text/javascript, */*; q=0.01",
  "X-Requested-With": "XMLHttpRequest",
  "User-Agent": "*",
  Referer: "https://kusonime.com/",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
  Connection: "keep-alive",
  Host: "kusonime.com",
  Origin: "https://kusonime.com",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-User": "?1",
  "Sec-Fetch-Site": "none",
};

interface Validator {
  etag?: string;
  lastModified?: string;
}

const sha1 = (value: string): string => createHash("sha1").update(value).digest("hex");
const validatorKey = (url: string): string => `upstream:etag:${sha1(url)}`;
const bodyKey = (url: string): string => `upstream:body:${sha1(url)}`;

// Jitter prevents retry stampedes when several pages fail together.
const retryDelay = (attempt: number): number => RETRY_BASE_MS * 2 ** attempt + Math.floor(Math.random() * 250);

const doFetch = async (
  absoluteUrl: string,
  validator: Validator | null,
  config?: UpstreamRequestConfig,
): Promise<Response> => {
  try {
    return await fetch(absoluteUrl, {
      method: "GET",
      headers: {
        ...DEFAULT_HEADERS,
        ...config?.headers,
        ...(validator?.etag ? { "If-None-Match": validator.etag } : {}),
        ...(validator?.lastModified ? { "If-Modified-Since": validator.lastModified } : {}),
      },
      signal: AbortSignal.timeout(config?.timeoutMs ?? TIMEOUT_MS),
      redirect: "follow",
    });
  } catch (error) {
    // Parity with axios timeout errors: expose ETIMEDOUT for health probes.
    if ((error as Error)?.name === "TimeoutError") {
      throw Object.assign(new Error("Upstream request timed out"), { code: "ETIMEDOUT" });
    }
    throw error;
  }
};

const toHeaderRecord = (headers: Headers): Record<string, string> => {
  const record: Record<string, string> = {};
  headers.forEach((value, key) => {
    record[key.toLowerCase()] = value;
  });
  return record;
};

const request = async (path: string, attempt = 0, config?: UpstreamRequestConfig): Promise<UpstreamResponse> => {
  // Fast-fail gate: once the breaker is open every request (including retries)
  // rejects immediately instead of hammering a challenged upstream.
  if (!canRequest(UPSTREAM_CIRCUIT_KEY)) {
    throw Object.assign(new Error("Upstream circuit is open — fast-failing to protect the scraper"), {
      code: "CIRCUIT_OPEN",
    });
  }

  const startedAt = Date.now();
  const absoluteUrl = new URL(path, SCRAPE_BASE_URL).toString();
  const finishAttempt = (): void => observeHistogram("upstream_request_duration_ms", Date.now() - startedAt);

  try {
    // Conditional GET: replay the stored validators so unchanged pages answer
    // 304 and we serve the cached body from Redis instead of re-downloading.
    const validator = (await redisGet(validatorKey(absoluteUrl))) as Validator | null;
    let response = await doFetch(absoluteUrl, validator, config);
    let status = response.status;

    if (status === 304 && validator) {
      const cachedBody = await redisGet(bodyKey(absoluteUrl));
      if (typeof cachedBody === "string" && cachedBody.includes("Kusonime")) {
        finishAttempt();
        recordSuccess(UPSTREAM_CIRCUIT_KEY);
        incrementMetric("upstream_success");
        return {
          data: cachedBody,
          status: 200,
          headers: toHeaderRecord(response.headers),
          request: { responseURL: absoluteUrl },
          config: { url: path },
        };
      }
      // Validator without a body (expired body key): re-fetch unconditionally.
      response = await doFetch(absoluteUrl, null, config);
      status = response.status;
    }

    if (status === 429 || status >= 500) {
      const data = await response.text().catch(() => "");
      throw Object.assign(new Error(`Upstream responded ${status}`), {
        response: { status, data, headers: toHeaderRecord(response.headers) },
      });
    }
    if (!response.ok) {
      const data = await response.text().catch(() => "");
      throw Object.assign(new Error(`Upstream responded ${status}`), {
        response: { status, data, headers: toHeaderRecord(response.headers) },
      });
    }

    const contentLength = Number(response.headers.get("content-length") ?? "0");
    if (contentLength > MAX_CONTENT_BYTES) {
      throw new Error("Upstream payload too large");
    }
    const data = await response.text();
    if (data.length > MAX_CONTENT_BYTES) {
      throw new Error("Upstream payload too large");
    }

    // Every genuine kusonime page carries the brand (title/footer/nav).
    // Anything else is a Cloudflare challenge/block page.
    if (!data.includes("Kusonime")) {
      throw new Error(`Upstream returned non-kusonime content (${data.length} bytes) — likely blocked or challenged`);
    }

    // Store validators + last body for conditional GETs (no-op without Redis).
    const etag = response.headers.get("etag") ?? undefined;
    const lastModified = response.headers.get("last-modified") ?? undefined;
    if (etag || lastModified) {
      void redisSet(validatorKey(absoluteUrl), { etag, lastModified }, VALIDATOR_TTL_SECONDS);
      void redisSet(bodyKey(absoluteUrl), data, VALIDATOR_TTL_SECONDS);
    }

    finishAttempt();
    recordSuccess(UPSTREAM_CIRCUIT_KEY);
    incrementMetric("upstream_success");
    return {
      data,
      status,
      headers: toHeaderRecord(response.headers),
      request: { responseURL: response.url || absoluteUrl },
      config: { url: path },
    };
  } catch (error) {
    finishAttempt();
    const status = (error as UpstreamErrorLike).response?.status;
    const retryable = !status || status === 429 || status >= 500;

    if (!retryable || attempt >= MAX_RETRIES) {
      if (retryable) {
        recordFailure(UPSTREAM_CIRCUIT_KEY);
        incrementMetric("upstream_failure");
      }
      throw error;
    }

    incrementMetric("upstream_retry");
    await new Promise((resolve) => setTimeout(resolve, retryDelay(attempt + 1)));
    return request(path, attempt + 1, config);
  }
};

// Fetch-native client. `.get(path)` mirrors the axios surface the scraper
// modules already consume: { data, status, headers, request, config }.
const upstream = {
  get: (path: string, config?: UpstreamRequestConfig): Promise<UpstreamResponse> => request(path, 0, config),
};

export default upstream;
