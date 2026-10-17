import { UPSTREAM_CIRCUIT_KEY } from "@/config/upstream";
import { getCircuitState } from "@/lib/circuit-breaker";
import { redisRateLimit } from "@/lib/redis";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes to avoid memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetTime <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 300_000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

function checkInMemory(identifier: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || record.resetTime <= now) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil(newRecord.resetTime / 1000),
    };
  }

  record.count++;
  const remaining = Math.max(0, limit - record.count);
  const success = record.count <= limit;

  return {
    success,
    limit,
    remaining,
    reset: Math.ceil(record.resetTime / 1000),
  };
}

// Adaptive tightening: while the upstream circuit is open/half-open every
// limit is scaled down so a struggling scraper cannot be hammered further.
// Cheap cached reads keep working; heavy endpoints feel it first.
export const scaleLimit = (limit: number, factor: number): number =>
  Math.max(Math.min(limit, 5), Math.floor(limit * factor));

const loadFactor = (): number => {
  try {
    const state = getCircuitState(UPSTREAM_CIRCUIT_KEY);
    if (state === "open") return 0.25;
    if (state === "half-open") return 0.5;
  } catch {
    // Never let limiter bookkeeping break a request.
  }
  return 1;
};

export async function checkRateLimit(identifier: string, limit = 60, windowMs = 60_000): Promise<RateLimitResult> {
  const effectiveLimit = scaleLimit(limit, loadFactor());

  // Shared counter when REDIS_URL is set — accurate across instances/restarts.
  const redisCount = await redisRateLimit(identifier, windowMs);
  if (redisCount !== null) {
    return {
      success: redisCount <= effectiveLimit,
      limit: effectiveLimit,
      remaining: Math.max(0, effectiveLimit - redisCount),
      reset: Math.ceil((Date.now() + windowMs) / 1000),
    };
  }

  return checkInMemory(identifier, effectiveLimit, windowMs);
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };
  if (!result.success) {
    headers["Retry-After"] = Math.max(1, result.reset - Math.floor(Date.now() / 1000)).toString();
  }
  return headers;
}
