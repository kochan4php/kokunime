import { UPSTREAM_URL } from "@/services/scraper/constants";

const MAX_RETRIES = 2;
const RETRY_BASE_MS = 500;

export interface UpstreamResponse {
  data: string;
  url: string;
  status: number;
}

export async function fetchUpstream(path: string, retryCount = 0): Promise<UpstreamResponse> {
  const url = path.startsWith("http") ? path : `${UPSTREAM_URL}${path.startsWith("/") ? path.slice(1) : path}`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://kusonime.com/",
      },
    });

    if (!res.ok) {
      const status = res.status;
      const retryable = status === 429 || status >= 500;
      if (retryable && retryCount < MAX_RETRIES) {
        const delay = RETRY_BASE_MS * 2 ** (retryCount + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchUpstream(path, retryCount + 1);
      }
      throw new Error(`Upstream request failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.text();
    return {
      data,
      url: res.url,
      status: res.status,
    };
  } catch (err: unknown) {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_BASE_MS * 2 ** (retryCount + 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchUpstream(path, retryCount + 1);
    }
    throw err;
  }
}

const upstream = {
  get: (path: string) => fetchUpstream(path),
};

export default upstream;

