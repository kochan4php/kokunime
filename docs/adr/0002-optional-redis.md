# ADR 0002 — Redis is optional; every feature degrades gracefully

**Status:** accepted (2026-10)

## Context

The production stack runs with a single Redis for cache, search index,
trending counters, APQ, and rate limiting. Self-hosters, CI, and local dev
often have no Redis. A hard dependency would make the app un-runnable
without infrastructure and make tests flaky.

## Decision

`src/lib/redis.ts` exposes `redisGet`, `redisSet`, `redisRateLimit`, and
`redisHealth`. Without `REDIS_URL` every call is a silent no-op: `get`
returns `null`, `set` returns `undefined`. Features built on top must treat
"no data" as the normal cold state:

- search index → empty results, `/api/suggest` answers `200` with `items: []`;
- trending → empty rail (component hides itself);
- APQ → every query executes as a normal POST;
- rate limiting → in-memory limiter per instance.

## Consequences

- `pnpm dev` and the full test suite run with zero infrastructure.
- Redis-less deployments lose cross-instance cache and ranking quality but
  never correctness.
- Code must not assume a value in Redis exists; "cold" paths are tested
  (see `tests/chaos.test.ts`).
