import { unstable_cache } from "next/cache";

export const TTL = {
  home: 10 * 60, // 10 minutes
  list: 10 * 60, // 10 minutes
  detail: 30 * 60, // 30 minutes
  genres: 2 * 60 * 60, // 2 hours
  seasons: 2 * 60 * 60, // 2 hours
  search: 5 * 60, // 5 minutes
  recommendations: 30 * 60, // 30 minutes
};

interface MemoryCacheEntry<T> {
  value: T;
  expiresAt: number;
}

// In-Memory L1 Fast Cache (Node process RAM) for sub-millisecond response times
const memoryCache = new Map<string, MemoryCacheEntry<unknown>>();
const MAX_MEMORY_ENTRIES = 500;

export const getFromMemoryCache = <T>(key: string): T | null => {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value as T;
};

export const setMemoryCache = <T>(key: string, value: T, ttlSeconds: number): void => {
  if (memoryCache.size >= MAX_MEMORY_ENTRIES) {
    const firstKey = memoryCache.keys().next().value;
    if (firstKey) memoryCache.delete(firstKey);
  }
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

export const cached = async <T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> => {
  // 1. Tier 1: Check In-Memory L1 RAM Cache (0.1ms)
  const memCached = getFromMemoryCache<T>(key);
  if (memCached !== null) {
    return memCached;
  }

  // 2. Tier 2: Check Next.js unstable_cache (when in Next.js runtime)
  if (typeof unstable_cache === "function" && process.env.NODE_ENV !== "test") {
    try {
      const cachedFn = unstable_cache(
        async () => {
          try {
            return await fn();
          } catch {
            return fallback;
          }
        },
        [key],
        { revalidate: ttlSeconds },
      );
      const result = await cachedFn();
      if (result !== null && result !== undefined) {
        setMemoryCache(key, result, ttlSeconds);
      }
      return result;
    } catch {
      // Fallback to direct execution
    }
  }

  // 3. Direct execution with In-Memory cache storage
  try {
    const result = await fn();
    if (result !== null && result !== undefined) {
      setMemoryCache(key, result, ttlSeconds);
    }
    return result;
  } catch {
    return fallback;
  }
};
