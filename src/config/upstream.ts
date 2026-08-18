import { UPSTREAM_URL } from "@/services/scraper/constants";

const MAX_RETRIES = 2;
const RETRY_BASE_MS = 500;
const TIMEOUT_MS = 10_000;
const MAX_CONTENT_LENGTH = 10 * 1024 * 1024; // 10MB limit

export interface UpstreamResponse {
  data: string;
  url: string;
  status: number;
}

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "id,en-US;q=0.9,en;q=0.8",
  "Sec-Ch-Ua": '"Chromium";v="131", "Not_A Brand";v="24"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

const FALLBACK_MIRRORS = (process.env.UPSTREAM_MIRRORS || "")
  .split(",")
  .map((m) => m.trim().replace(/\/$/, ""))
  .filter(Boolean);

const ALL_UPSTREAMS = [UPSTREAM_URL, ...FALLBACK_MIRRORS];

export const ALLOWED_HOSTS = new Set([
  new URL(UPSTREAM_URL).hostname.toLowerCase(),
  ...FALLBACK_MIRRORS.map((m) => {
    try {
      return new URL(m).hostname.toLowerCase();
    } catch {
      return "";
    }
  }).filter(Boolean),
]);

export function isAllowedUpstreamUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "169.254.169.254" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }
    return ALLOWED_HOSTS.has(hostname) || hostname.endsWith("kusonime.com");
  } catch {
    return false;
  }
}

let failureCount = 0;
let circuitOpenUntil = 0;
const CIRCUIT_THRESHOLD = 5;
const CIRCUIT_RESET_MS = 15_000;

export async function fetchUpstream(path: string, retryCount = 0, mirrorIndex = 0): Promise<UpstreamResponse> {
  if (Date.now() < circuitOpenUntil) {
    throw new Error("Upstream circuit breaker open: service temporarily unavailable");
  }

  if (path.startsWith("http") && !isAllowedUpstreamUrl(path)) {
    throw new Error(`SSRF blocked: URL is not in upstream whitelist`);
  }

  const currentBase = ALL_UPSTREAMS[mirrorIndex] || UPSTREAM_URL;
  const targetUrl = path.startsWith("http") ? path : `${currentBase}${path.startsWith("/") ? "" : "/"}${path}`;

  try {
    const res = await fetch(targetUrl, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: DEFAULT_HEADERS,
    });

    const status = res.status;
    const retryable = status === 429 || status >= 500;

    if (!res.ok) {
      if (retryable && retryCount < MAX_RETRIES) {
        const delay = RETRY_BASE_MS * 2 ** (retryCount + 1) + Math.floor(Math.random() * 200);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchUpstream(path, retryCount + 1, mirrorIndex);
      }
      if (mirrorIndex + 1 < ALL_UPSTREAMS.length) {
        return fetchUpstream(path, 0, mirrorIndex + 1);
      }
      failureCount++;
      if (failureCount >= CIRCUIT_THRESHOLD) {
        circuitOpenUntil = Date.now() + CIRCUIT_RESET_MS;
      }
      throw new Error(`Upstream request failed: ${res.status} ${res.statusText}`);
    }

    const contentLength = Number(res.headers.get("content-length"));
    if (contentLength && contentLength > MAX_CONTENT_LENGTH) {
      throw new Error(`Upstream response exceeded max length: ${contentLength}`);
    }

    const data = await res.text();
    failureCount = 0;
    circuitOpenUntil = 0;
    return {
      data,
      url: res.url,
      status: res.status,
    };
  } catch (err: unknown) {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_BASE_MS * 2 ** (retryCount + 1) + Math.floor(Math.random() * 200);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchUpstream(path, retryCount + 1, mirrorIndex);
    }
    if (mirrorIndex + 1 < ALL_UPSTREAMS.length) {
      return fetchUpstream(path, 0, mirrorIndex + 1);
    }
    failureCount++;
    if (failureCount >= CIRCUIT_THRESHOLD) {
      circuitOpenUntil = Date.now() + CIRCUIT_RESET_MS;
    }
    throw err;
  }
}

const upstream = {
  get: (path: string) => fetchUpstream(path),
};

export default upstream;
