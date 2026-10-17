import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { canRequest, recordFailure, recordSuccess } from "@/lib/circuit-breaker";
import { incrementMetric } from "@/lib/metrics";
import { SCRAPE_BASE_URL } from "@/services/scraper/constants";

const MAX_RETRIES = 2;
const RETRY_BASE_MS = 500;

// Single upstream host — one breaker guards it. Consumed by /api/ready.
export const UPSTREAM_CIRCUIT_KEY = "kusonime-upstream";

interface RetryConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

// Faithful restore of the last known-good direct-scrape config (7e34949,
// Aug 9): withCredentials, bare "*" UA, Host header, and the DEFAULT Node
// agent — one fresh socket per request, no keep-alive pooling. The keep-alive
// agents added in 1181759 reused challenged sockets and never validated.
const upstream: AxiosInstance = axios.create({
  baseURL: SCRAPE_BASE_URL,
  withCredentials: true,
  timeout: 10_000,
  maxContentLength: 10 * 1024 * 1024,
  headers: {
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
  },
});

// Fast-fail gate: once the breaker is open every request (including retries)
// rejects immediately instead of hammering a challenged upstream.
upstream.interceptors.request.use((config) => {
  if (!canRequest(UPSTREAM_CIRCUIT_KEY)) {
    return Promise.reject(
      Object.assign(new Error("Upstream circuit is open — fast-failing to protect the scraper"), {
        code: "CIRCUIT_OPEN",
      }),
    );
  }
  return config;
});

// Every genuine kusonime page carries the brand (title/footer/nav). Anything
// else is a Cloudflare challenge/block page — reject it so parsers never
// mistake it for an empty result set.
const UPSTREAM_MARK = "Kusonime";

upstream.interceptors.response.use((response) => {
  const data: unknown = response.data;
  if (typeof data === "string" && !data.includes(UPSTREAM_MARK)) {
    return Promise.reject(
      new Error(`Upstream returned non-kusonime content (${data.length} bytes) — likely blocked or challenged`),
    );
  }
  recordSuccess(UPSTREAM_CIRCUIT_KEY);
  incrementMetric("upstream_success");
  return response;
});

upstream.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const retryable = !status || status === 429 || status >= 500;

    if (!config || !retryable || (config.retryCount ?? 0) >= MAX_RETRIES) {
      if (retryable) {
        recordFailure(UPSTREAM_CIRCUIT_KEY);
        incrementMetric("upstream_failure");
      }
      return Promise.reject(error);
    }

    config.retryCount = (config.retryCount ?? 0) + 1;
    incrementMetric("upstream_retry");
    // Jitter prevents retry stampedes when several pages fail together.
    const delay = RETRY_BASE_MS * 2 ** config.retryCount + Math.floor(Math.random() * 250);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return upstream.request(config);
  },
);

export default upstream;
