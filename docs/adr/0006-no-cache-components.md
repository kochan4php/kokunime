# ADR 0006 — `cacheComponents` / PPR stays off; routes are explicitly dynamic

**Status:** accepted (2026-10)

## Context

Next.js 16 offers `cacheComponents` (formerly PPR) to mix static shells with
streamed dynamic holes. Kokunime was trialled on it: 34 route segments use
`export const dynamic = "force-dynamic"` (catalog, search, genres, seasons,
anime detail, most API routes), because upstream data must never be frozen
into a build-time shell. Enabling the flag makes those segment configs a hard
build error:

> Route segment config "dynamic" is not compatible with `nextConfig.cacheComponents`.

## Decision

Keep `cacheComponents` disabled. Cache behavior stays explicit and per-route:

- catalog/search/genres/seasons: no HTTP cache, live upstream through the
  shared cache tier (ADR 0001);
- anime detail: `unstable_cache` with TTL;
- APIs: `s-maxage` + `stale-while-revalidate` per route.

`next.config.mjs` carries a comment pointing here so nobody re-trials the flag
by accident.

## Consequences

- Zero migration risk; every route's freshness is visible in its own file.
- We forgo partial prerendering; static shells for dynamic routes will need a
  deliberate per-route redesign later, not a global flag flip.
- Revisit only if most `force-dynamic` routes disappear first.
