import { UPSTREAM_URL } from "@/services/scraper/constants";

const MAX_RETRIES = 2;
const RETRY_BASE_MS = 500;

const ALLOWED_HOSTS = new Set(["kusonime.com", "www.kusonime.com"]);

export function isAllowedUpstreamUrl(targetUrl: string): boolean {
  try {
    const parsed = new URL(targetUrl);
    return ALLOWED_HOSTS.has(parsed.hostname.toLowerCase()) || parsed.hostname.endsWith(".kusonime.com");
  } catch {
    return false;
  }
}

export function calculateBackoff(retryCount: number): number {
  const base = RETRY_BASE_MS * 2 ** retryCount;
  const jitter = Math.floor(Math.random() * 200);
  return base + jitter;
}

export interface UpstreamResponse {
  data: string;
  url: string;
  status: number;
}

const inFlightRequests = new Map<string, Promise<UpstreamResponse>>();

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
];

export async function fetchUpstream(path: string, retryCount = 0): Promise<UpstreamResponse> {
  const url = path.startsWith("http") ? path : `${UPSTREAM_URL}${path.startsWith("/") ? path.slice(1) : path}`;

  if (!isAllowedUpstreamUrl(url)) {
    throw new Error(`SSRF Guard: Disallowed upstream destination (${url})`);
  }

  // Singleflight: coalesce concurrent requests for the exact same URL
  if (retryCount === 0 && inFlightRequests.has(url)) {
    const existing = inFlightRequests.get(url);
    if (existing) return existing;
  }

  const userAgent = USER_AGENTS[retryCount % USER_AGENTS.length];

  const promise = (async (): Promise<UpstreamResponse> => {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10_000),
        headers: {
          "User-Agent": userAgent,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          Referer: "https://kusonime.com/",
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) {
        const status = res.status;
        const retryable = status === 403 || status === 429 || status >= 500;
        if (retryable && retryCount < MAX_RETRIES) {
          const delay = calculateBackoff(retryCount);
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
      if (retryCount < MAX_RETRIES && !(err instanceof Error && err.message.startsWith("SSRF Guard"))) {
        const delay = calculateBackoff(retryCount);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchUpstream(path, retryCount + 1);
      }
      throw err;
    } finally {
      if (retryCount === 0) {
        inFlightRequests.delete(url);
      }
    }
  })();

  if (retryCount === 0) {
    inFlightRequests.set(url, promise);
  }

  return promise;
}

const upstream = {
  get: (path: string) => fetchUpstream(path),
};

export default upstream;
