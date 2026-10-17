import { createClient } from "redis";

// Optional shared Redis layer. Everything is env-gated on REDIS_URL:
// without it every helper degrades to a fast no-op, so local dev / tests /
// deployments that don't need Redis behave exactly as before.
const KEY_PREFIX = "kokunime:";
const CONNECT_TIMEOUT_MS = 1500;
const RETRY_BACKOFF_MS = 30_000;

const makeClient = (url: string) =>
  createClient({
    url,
    socket: {
      connectTimeout: CONNECT_TIMEOUT_MS,
      reconnectStrategy: (retries) => (retries > 5 ? false : Math.min(retries * 250, 2000)),
    },
  });

// Derived from the factory call site so the generic parameters line up
// with what createClient() actually returns.
type RedisClient = ReturnType<typeof makeClient>;

let client: RedisClient | null = null;
let connectPromise: Promise<RedisClient | null> | null = null;
let lastFailureAt = 0;

export const isRedisConfigured = (): boolean => Boolean(process.env.REDIS_URL?.trim());

export async function getRedis(): Promise<RedisClient | null> {
  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;
  if (client?.isReady) return client;
  // Don't hammer a down server on every cache read.
  if (Date.now() - lastFailureAt < RETRY_BACKOFF_MS && !connectPromise) return null;
  if (!connectPromise) {
    connectPromise = (async () => {
      try {
        const next = makeClient(url);
        next.on("error", () => {
          // Connection errors are handled by call sites; a listener is required
          // so node-redis never crashes the process with an unhandled 'error'.
        });
        await next.connect();
        client = next;
        lastFailureAt = 0;
        return client;
      } catch {
        lastFailureAt = Date.now();
        return null;
      } finally {
        connectPromise = null;
      }
    })();
  }
  return connectPromise;
}

export async function redisGet(key: string): Promise<unknown | null> {
  const c = await getRedis();
  if (!c) return null;
  try {
    const raw = await c.get(`${KEY_PREFIX}cache:${key}`);
    return raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

export async function redisSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const c = await getRedis();
  if (!c) return;
  try {
    await c.set(`${KEY_PREFIX}cache:${key}`, JSON.stringify(value), { EX: Math.max(1, Math.floor(ttlSeconds)) });
  } catch {}
}

// Returns the incremented counter for rate limiting, or null when Redis is
// unavailable (caller falls back to the in-memory store).
export async function redisRateLimit(key: string, windowMs: number): Promise<number | null> {
  const c = await getRedis();
  if (!c) return null;
  try {
    const fullKey = `${KEY_PREFIX}ratelimit:${key}`;
    const count = await c.incr(fullKey);
    if (count === 1) {
      await c.pExpire(fullKey, windowMs);
    }
    return count;
  } catch {
    return null;
  }
}

export async function redisHealth(): Promise<"disabled" | "connected" | "error"> {
  if (!isRedisConfigured()) return "disabled";
  const c = await getRedis();
  if (!c) return "error";
  try {
    await c.ping();
    return "connected";
  } catch {
    return "error";
  }
}
