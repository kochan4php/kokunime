import { unstable_cache } from "next/cache";

export const TTL = {
  anime: 15 * 60,
  detail: 15 * 60,
  search: 15 * 60,
  byGenre: 30 * 60,
  bySeason: 30 * 60,
  recommendations: 30 * 60,
  genres: 60 * 60,
  seasons: 60 * 60,
};

export const cached = async <T>(key: string, ttlSeconds: number, fn: () => Promise<T>, fallback: T): Promise<T> => {
  const cachedFn = unstable_cache(
    async () => {
      try {
        return await fn();
      } catch {
        // Cache the fallback too: when kusonime is down, the first request pays
        // the retry/timeout cost and the rest get the cached empty result
        // instead of each hanging ~30s. ponytail: fallback is cached for the
        // full TTL — a short outage leaves stale empties until revalidate.
        return fallback;
      }
    },
    [key],
    { revalidate: ttlSeconds },
  );
  return cachedFn();
};
