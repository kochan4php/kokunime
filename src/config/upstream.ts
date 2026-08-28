import http from "node:http";
import https from "node:https";
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { SCRAPE_BASE_URL } from "@/services/scraper/constants";

const MAX_RETRIES = 2;
const RETRY_BASE_MS = 500;

// Real-browser + crawler UAs, rotated per request. kusonime's Cloudflare
// blocks datacenter IPs with a 403 challenge; the crawler UAs (Googlebot/
// Bingbot) are not challenged, so rotating UAs and retrying on 403 is what
// keeps direct scraping alive. This is the pre-worker bypass, restored.
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
];

const pickUserAgent = (seed = Math.random()): string => USER_AGENTS[Math.floor(seed * USER_AGENTS.length)];

const httpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 30_000,
  maxSockets: 64,
  maxFreeSockets: 32,
  timeout: 10_000,
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30_000,
  maxSockets: 64,
  maxFreeSockets: 32,
  timeout: 10_000,
});

interface RetryConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

const upstream: AxiosInstance = axios.create({
  baseURL: SCRAPE_BASE_URL,
  timeout: 10_000,
  maxContentLength: 10 * 1024 * 1024,
  httpAgent,
  httpsAgent,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    Referer: "https://kusonime.com/",
    "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
      Connection: "keep-alive",
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

upstream.interceptors.request.use((config) => {
  config.headers["User-Agent"] = pickUserAgent();
  return config;
});

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
    config.headers["User-Agent"] = pickUserAgent(config.retryCount / (MAX_RETRIES + 1));
    const delay = RETRY_BASE_MS * 2 ** config.retryCount;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return upstream.request(config);
  },
);

export default upstream;
