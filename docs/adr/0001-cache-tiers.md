# ADR 0001 — Three-tier cache with stale-while-revalidate

**Status:** accepted (2026-10)

## Context

Every page is scraped from a single upstream (kusonime). Upstream latency is
seconds, it is occasionally down, and it rate-limits bursts. Serving pages
without any cache would make the site slow and hammer the upstream.

## Decision

All scraper reads go through `src/services/cache.ts`, which layers:

1. **In-process memory** (fast, per-instance, TTL-bounded);
2. **Redis** (shared across instances, optional — see ADR 0002);
3. **Upstream fetch** on miss, with the result written back to both tiers.

Entries carry `CacheTier` ("hit" | "miss" | "stale") which flows into
`X-Cache` headers and metrics. Redis writes are fire-and-forget: a Redis
outage never fails a request that the upstream could serve.

## Consequences

- Repeat views are memory-fast; cold instances are Redis-fast.
- Data can be up to one TTL stale; detail pages are invalidated explicitly
  (`/api/admin/revalidate`) when correctness matters.
- Tier visibility makes cache regressions measurable via `/api/metrics`.
