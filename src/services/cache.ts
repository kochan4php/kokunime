type CacheEntry = { value: unknown; expiresAt: number };

const store = new Map<string, CacheEntry>();

export const TTL = {
  anime: 15 * 60 * 1000,
  detail: 15 * 60 * 1000,
  search: 15 * 60 * 1000,
  byGenre: 30 * 60 * 1000,
  bySeason: 30 * 60 * 1000,
  recommendations: 30 * 60 * 1000,
  genres: 60 * 60 * 1000,
  seasons: 60 * 60 * 1000,
};

export const getCached = <T>(key: string): T | undefined => {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
};

export const setCached = <T>(key: string, value: T, ttlMs: number): T => {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
};

export const cached = async <T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> => {
  const hit = getCached<T>(key);
  if (hit !== undefined) return hit;
  const value = await fn();
  return setCached(key, value, ttlMs);
};
