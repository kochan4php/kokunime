# ADR 0009 — Module size budget + dead-export policy

**Status:** accepted (2026-10)

## Context

Several files had grown past 850 lines (bookmarks page, settings page content,
compare client). Large files slow review, hide dead code, and make every change
riskier. A one-off cleanup does not hold — without a gate, size creeps back.

## Decision

Two rules, both enforced:

1. **Size budget: 450 lines per file** under `src/`. `scripts/file-size-budget.mjs`
   prints the 10 largest files on every run and **fails CI** (and local gates)
   when any file exceeds the limit. Splitting follows the existing pattern:
   presentational pieces under `src/components/<area>/`, derived state into
   `src/hooks/`, pure helpers into `src/utils/`.
2. **No unused exports.** `scripts/find-unused-exports.mjs` scans every export
   against the import graph; the list must stay at zero. Framework-injected
   symbols live in its `SKIP_EXPORTS` list with a reason. When an export turns
   out to be internal, de-export it; when a whole module is dead, delete it
   (this is how `src/lib/api-auth.ts` and the cheerio cleanup helpers went).

The budget is a ceiling, not a target: refactors are done when the module has
a natural seam, not to shave lines.

## Consequences

- Reviews stay small; dead code cannot hide behind exports.
- A genuinely unavoidable large file (generated data like the i18n
  dictionary or `openapi.json` route) sits near the limit and must be split or
  generated differently when it grows.
- Heuristic scripts have known false negatives (dynamic lookups); CI treats
  them as gates only where the heuristics are exact (size) and report-only
  where they are not (untested-module report).
