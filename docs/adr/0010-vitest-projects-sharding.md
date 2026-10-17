# ADR 0010 — Vitest runs as two projects (node + dom) and CI shards them

**Status:** accepted (2026-10)

## Context

The suite mixes environments: parser/API/contract tests need plain Node
(no DOM globals, real timers), while a11y/interaction tests need jsdom. Running
everything under jsdom was slow and made node tests accidentally depend on
browser globals. CI also ran the full suite twice (once in `verify`, once in a
separate test job).

## Decision

`vitest.config.ts` defines two projects on a shared base config:

- **node** — default for `tests/**` (API contract, chaos, fuzz, logger, utils);
- **dom** — jsdom for `tests/{a11y,download-anchors,honeypot-a11y,interactions}.test.*`
  (files may also opt in via `// @vitest-environment`).

CI runs one `unit-tests` job with a shard matrix (`--shard=1/2`, `2/2`); the
`verify` job no longer runs `pnpm test` (no duplicate run). Locally: `pnpm test`,
`pnpm test --project node`, `pnpm test --shard=1/2`.

## Consequences

- Faster suite and no phantom DOM globals in node tests.
- A test that needs both worlds must stub the missing one explicitly — which
  is the point.
- Adding a DOM test means adding the file glob (or the per-file pragma);
  the project list is the single source of truth.
- Sharding is over files, so one very slow file (the parser benchmark) bounds
  the wall clock; keep the benchmark adaptive (see its budget env var).
