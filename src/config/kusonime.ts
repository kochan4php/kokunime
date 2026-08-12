import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const MAX_RETRIES = 2;
const RETRY_BASE_MS = 500;

interface RetryConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

const kusonime: AxiosInstance = axios.create({
  baseURL: "https://kusonime.com",
  timeout: 10_000,
  // Cap a pathological upstream response — the docker deploy runs in 512MB.
  maxContentLength: 10 * 1024 * 1024,
  headers: {
    "User-Agent": "Kokunime/1.0 (+https://kokunime.netlify.app)",
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
