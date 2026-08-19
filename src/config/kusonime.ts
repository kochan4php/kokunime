import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const MAX_RETRIES = 2;
const RETRY_BASE_MS = 500;

interface RetryConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

const kusonime: AxiosInstance = axios.create({
  baseURL: "https://kusonime.com",
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

kusonime.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const retryable = !status || status === 429 || status >= 500;

    if (!config || !retryable || (config.retryCount ?? 0) >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    config.retryCount = (config.retryCount ?? 0) + 1;
    const delay = RETRY_BASE_MS * 2 ** config.retryCount;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return kusonime.request(config);
  },
);

export default kusonime;
