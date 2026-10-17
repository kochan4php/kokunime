# ADR 0005 — Hand-written service worker with per-tier caches

**Status:** accepted (2026-10)

## Context

The PWA needs offline support: app shell, listing pages, anime posters/API
responses, and an explicit "save offline" action per title. `next-pwa`-style
tooling adds a dependency and hides cache strategy; Workbox would be a new
package for a single-file need.

## Decision

`public/sw.js` is a small hand-written worker with named cache buckets and
per-class strategies:

- **STATIC** — hashed build assets, cache-first, refreshed on new build ID
  (the SW URL is cache-busted per deploy).
- **PAGES** — HTML navigations, network-first with stale fallback and a
  `/offline` route when nothing is cached.
- **API** — GET JSON, stale-while-revalidate.
- **SAVED** — explicit per-title offline copies created by the
  "Simpan offline" button (and removable again).

Background sync (`sync`/`periodicsync` tag `kokunime-refresh-saved`)
refreshes saved titles opportunistically. Registration is guarded so it only
activates in production and never blocks first paint.

## Consequences

- No new dependency; cache behavior is inspectable in one file.
- Correctness burden is ours: cache names are versioned by build ID, and
  every strategy is written to fail open (network error → cache → offline).
- Push notifications were deliberately not implemented; badging uses
  `setAppBadge` fed by the release inbox instead.
