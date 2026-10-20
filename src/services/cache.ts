import { CACHE_TTL_SECONDS } from "@/config/constants";
import { incrementMetric, observeHistogram } from "@/lib/metrics";
import { onCacheInvalidate, publishCacheInvalidate, redisGet, redisSet } from "@/lib/redis";
import { currentRequestId } from "@/lib/request-context";
import { recordSlowRequest, SLOW_REQUEST_MS } from "@/lib/slow-log";
import { unstable_cache } from "next/cache";

// When the upstream catalog was last actually fetched (any key, any tier).
// Sitemap lastmod reads this so dates reflect real data freshness instead of
// "now" on every regeneration.
let lastUpstreamFetchAt = 0;

export const getLastUpstreamFetchAt = (): number => lastUpstreamFetchAt;

const timed = async <T>(fn: () => Promise<T>): Promise<T> => {
  const startedAt = Date.now();
  try {
    const value = await fn();
    lastUpstreamFetchAt = Date.now();
    return value;
  } finally {
    const durationMs = Date.now() - startedAt;
    observeHistogram("cache_compute_duration_ms", durationMs);
    // The upstream fetch dominates slow requests; the ring buffer gets the
    // request-id from the handler context when present.
    if (durationMs >= SLOW_REQUEST_MS) {
      recordSlowRequest({
        at: new Date().toISOString(),
        event: "cache_compute",
        durationMs,
        requestId: currentRequestId(),
      });
    }
  }
};

// Values live in src/config/constants.ts; re-exported under the old name so
// existing consumers keep reading TTL.detail etc.
export const TTL = CACHE_TTL_SECONDS;

// Which cache path served a value — surfaced as X-Cache headers by API routes
// and counted in /api/metrics.
export type CacheTier = "memory" | "redis" | "next" | "miss" | "stale" | "fallback";

interface CachedResult<T> {
  value: T;
  tier: CacheTier;
  // Epoch ms when the upstream value was fetched. 0 means "unknown" (a
  // fallback, or a shared value written before this metadata existed).
  fetchedAt: number;
}

const TIER_EVENT: Record<CacheTier, string> = {
  memory: "cache_hit_memory",
  redis: "cache_hit_redis",
  next: "cache_hit_next",
  miss: "cache_miss",
  stale: "cache_stale",
  fallback: "cache_fallback",
};

export const xCacheHeaders = (tier: CacheTier): Record<string, string> => ({
  "X-Cache": tier === "memory" || tier === "redis" || tier === "next" ? "HIT" : tier.toUpperCase(),
  "X-Cache-Tier": tier,
});

interface MemoryCacheEntry<T> {
  value: T;
  expiresAt: number;
  fetchedAt: number;
}

// In-Memory L1 Fast Cache (Node process RAM) for sub-millisecond response times
const memoryCache = new Map<string, MemoryCacheEntry<unknown>>();
const MAX_MEMORY_ENTRIES = 500;

// Last known-good values kept past their TTL: an upstream outage degrades to
// slightly stale data instead of an empty fallback.
const staleCache = new Map<string, { value: unknown; staleUntil: number; fetchedAt: number }>();
const STALE_GRACE_MS = 24 * 60 * 60 * 1000;

// Single-flight: concurrent misses for the same key share one upstream fetch.
const inFlight = new Map<string, Promise<CachedResult<unknown>>>();

// Sibling instances publish invalidations (see src/lib/redis.ts): drop the
// affected local tiers. null = flush everything (admin revalidate).
let invalidateRegistered = false;
const ensureInvalidation = (): void => {
  if (invalidateRegistered) return;
  invalidateRegistered = true;
  onCacheInvalidate((key) => {
    if (key === null) {
      memoryCache.clear();
      staleCache.clear();
      return;
    }
    memoryCache.delete(key);
    staleCache.delete(key);
  });
};

const getFromMemoryCache = <T>(key: string): { value: T; fetchedAt: number } | null => {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return { value: entry.value as T, fetchedAt: entry.fetchedAt };
};

const setMemoryCache = <T>(key: string, value: T, ttlSeconds: number, fetchedAt: number): void => {
  if (memoryCache.size >= MAX_MEMORY_ENTRIES) {
    const firstKey = memoryCache.keys().next().value;
    if (firstKey) memoryCache.delete(firstKey);
  }
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
    fetchedAt,
  });
};

const rememberStale = (key: string, value: unknown, ttlSeconds: number, fetchedAt: number): void => {
  if (staleCache.size >= MAX_MEMORY_ENTRIES && !staleCache.has(key)) {
    const firstKey = staleCache.keys().next().value;
    if (firstKey) staleCache.delete(firstKey);
  }
  staleCache.set(key, {
    value,
    staleUntil: Date.now() + ttlSeconds * 1000 + STALE_GRACE_MS,
    fetchedAt,
  });
};

const getStale = <T>(key: string): { value: T; fetchedAt: number } | null => {
  const entry = staleCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.staleUntil) {
    staleCache.delete(key);
    return null;
  }
  return { value: entry.value as T, fetchedAt: entry.fetchedAt };
};

const rememberLocally = <T>(key: string, value: T, ttlSeconds: number, fetchedAt: number): void => {
  setMemoryCache(key, value, ttlSeconds, fetchedAt);
  rememberStale(key, value, ttlSeconds, fetchedAt);
};

const metaKey = (key: string): string => `meta:${key}`;

const getStoredFetchedAt = async (key: string): Promise<number> => {
  // Redis is authoritative: a sibling instance may have refreshed the value
  // after this process kept its older local copy.
  const shared = await redisGet(metaKey(key));
  if (typeof shared === "number" && Number.isFinite(shared) && shared > 0) return shared;
  return memoryCache.get(key)?.fetchedAt ?? staleCache.get(key)?.fetchedAt ?? 0;
};

const storeFresh = async <T>(key: string, value: T, ttlSeconds: number, fetchedAt: number): Promise<void> => {
  rememberLocally(key, value, ttlSeconds, fetchedAt);
  await redisSet(key, value, ttlSeconds);
  // Keep the fetch timestamp beside the value; detail pages read it to show
  // "diperbarui" without pretending a cache hit is fresh upstream data.
  await redisSet(metaKey(key), fetchedAt, ttlSeconds + Math.floor(STALE_GRACE_MS / 1000));
  // Tell sibling instances to drop their local copies of this key.
  void publishCacheInvalidate(key);
};

export const cachedWithMeta = async <T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
  fallback: T,
): Promise<CachedResult<T>> => {
  ensureInvalidation();

  // 1. Tier 1: Check In-Memory L1 RAM Cache (0.1ms)
  const memCached = getFromMemoryCache<T>(key);
  if (memCached !== null) {
    incrementMetric(TIER_EVENT.memory);
    return { value: memCached.value, tier: "memory", fetchedAt: memCached.fetchedAt };
  }

  // Single-flight gate: callers racing on the same cold key await one fetch.
  const pending = inFlight.get(key);
  if (pending) {
    return (await pending) as CachedResult<T>;
  }

  const work = (async (): Promise<CachedResult<T>> => {
    // 1.5 Tier: Shared Redis cache (survives restarts, spans instances). No-op
    // unless REDIS_URL is configured.
    const redisCached = await redisGet(key);
    if (redisCached !== null) {
      const value = redisCached as T;
      // Already in shared cache — only hydrate local tiers (no write-back).
      const fetchedAt = await getStoredFetchedAt(key);
      rememberLocally(key, value, ttlSeconds, fetchedAt);
      return { value, tier: "redis", fetchedAt };
    }

    // 2. Tier 2: Check Next.js unstable_cache (when in Next.js runtime)
    // Failures must propagate OUTSIDE unstable_cache: a fallback returned inside
    // the callback would be persisted as if it were valid data (cache poisoning).
    if (typeof unstable_cache === "function" && process.env.NODE_ENV !== "test") {
      class UpstreamFailure extends Error {}
      let fetchedThisCall = 0;
      const cachedFn = unstable_cache(
        async () => {
          try {
            const value = await timed(fn);
            fetchedThisCall = Date.now();
            return value;
          } catch {
            throw new UpstreamFailure();
          }
        },
        [key],
        { revalidate: ttlSeconds },
      );
      try {
        const result = await cachedFn();
        // On a Next cache hit the callback did not run; reuse the stored
        // timestamp instead of claiming the data was refreshed now.
        const fetchedAt = fetchedThisCall || (await getStoredFetchedAt(key));
        if (result !== null && result !== undefined) {
          await storeFresh(key, result, ttlSeconds, fetchedAt);
        }
        return { value: result, tier: "next", fetchedAt };
      } catch (err) {
        if (err instanceof UpstreamFailure) {
          // Upstream failed: prefer the last known-good value over the fallback.
          const stale = getStale<T>(key);
          if (stale !== null) return { value: stale.value, tier: "stale", fetchedAt: stale.fetchedAt };
          return { value: fallback, tier: "fallback", fetchedAt: 0 };
        }
        // Cache layer itself is unavailable (no request context / infra error):
        // fall through to honest direct execution instead of masking data.
      }
    }

    // 3. Direct execution with In-Memory cache storage
    try {
      const result = await timed(fn);
      const fetchedAt = Date.now();
      if (result !== null && result !== undefined) {
        await storeFresh(key, result, ttlSeconds, fetchedAt);
      }
      return { value: result, tier: "miss", fetchedAt };
    } catch {
      const stale = getStale<T>(key);
      if (stale !== null) return { value: stale.value, tier: "stale", fetchedAt: stale.fetchedAt };
      return { value: fallback, tier: "fallback", fetchedAt: 0 };
    }
  })();

  const tracked = work
    .then((result) => {
      incrementMetric(TIER_EVENT[result.tier]);
      return result;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, tracked as Promise<CachedResult<unknown>>);
  return tracked;
};

export const cached = async <T>(key: string, ttlSeconds: number, fn: () => Promise<T>, fallback: T): Promise<T> => {
  return (await cachedWithMeta(key, ttlSeconds, fn, fallback)).value;
};
