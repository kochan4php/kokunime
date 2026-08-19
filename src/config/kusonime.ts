const MAX_RETRIES = 2;
const RETRY_BASE_MS = 500;

export interface KusonimeResponse {
  data: string;
  url: string;
  status: number;
}

export async function fetchKusonime(path: string, retryCount = 0): Promise<KusonimeResponse> {
  const url = path.startsWith("http") ? path : `https://kusonime.com${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent": "*",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      const status = res.status;
      const retryable = status === 429 || status >= 500;
      if (retryable && retryCount < MAX_RETRIES) {
        const delay = RETRY_BASE_MS * 2 ** (retryCount + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchKusonime(path, retryCount + 1);
      }
      throw new Error(`Kusonime request failed: ${res.status} ${res.statusText}`);
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
      return fetchKusonime(path, retryCount + 1);
    }
    throw err;
  }
}

const kusonime = {
  get: (path: string) => fetchKusonime(path),
};

export default kusonime;
