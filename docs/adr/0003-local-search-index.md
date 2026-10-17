# ADR 0003 — Local search index merged into upstream results

**Status:** accepted (2026-10)

## Context

Search proxies the upstream search endpoint. Upstream search is exact and
sometimes misses obvious matches (romaji vs English titles, punctuation,
common abbreviations). It also fails entirely when upstream is slow or down.

## Decision

`src/lib/search-index.ts` keeps a Redis-backed index of titles seen while
browsing listing pages (`kokunime:idx:titles` hash, in-process snapshot with
a 5-minute TTL). Search flows merge both sources:

1. upstream results win on conflict (source of truth);
2. local fuzzy matches (prefix > substring > subsequence) fill the tail,
   capped at 30 merged entries;
3. ranking uses `rankIndexItems` with query syntax support
   (`genre:a,b`, `-exclude`, `aliases` in `src/config/search-aliases.ts`).

Index warm-up happens implicitly while serving listing pages (throttled to
one re-index signature per 60s) and explicitly via `POST /api/admin/index`.

## Consequences

- Better recall for romaji/alias queries, and search still answers when the
  upstream endpoint errors (degraded, not dead).
- Index freshness trails the catalog; new titles appear once their listing
  page has been visited or after an admin warm-up.
- No new dependency: scoring is a small local implementation.
