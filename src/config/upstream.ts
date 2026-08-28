import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { SCRAPE_BASE_URL } from "@/services/scraper/constants";

const MAX_RETRIES = 2;
const RETRY_BASE_MS = 500;

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
  return response;
});

upstream.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const retryable = !status || status === 403 || status === 429 || status >= 500;

    if (!config || !retryable || (config.retryCount ?? 0) >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    config.retryCount = (config.retryCount ?? 0) + 1;
    const delay = RETRY_BASE_MS * 2 ** config.retryCount;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return upstream.request(config);
  },
);

export default upstream;