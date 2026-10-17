# ADR 0007 — Upstream HTTP is fetch-native; axios is gone

**Status:** accepted (2026-10)

## Context

The upstream client (`src/config/upstream.ts`) is the hot path for every page:
scraper requests, retries, circuit breaker, jitter backoff. It historically
used axios, a ~30KB dependency, for features Node's `fetch` now has natively
(timeouts via `AbortSignal`, headers, redirect control).

## Decision

Drop axios and keep `fetch`. To avoid touching ~dozens of call sites, the
module preserves the old surface exactly:

- resolves `{ data: string, headers: Record<string, string>, request:
  { responseURL }, config: { url } }` — headers are a plain lowercase record,
  not a `Headers` instance;
- rejects with an axios-shaped error (`response.status`, `response.data`,
  `response.headers`) so existing catch blocks and error classification keep
  working;
- retries with exponential backoff + random jitter, and records failures on
  the shared circuit breaker (`UPSTREAM_CIRCUIT_KEY`).

A parity test asserts the shape so a future refactor cannot silently change it.

## Consequences

- One less runtime dependency; no transitive axios tree.
- Response shape differs from native `fetch` on purpose — **callers must not
  migrate to `response.headers.get(...)`**; the `headers` field is a record.
- If fetch growns new needs (HTTP/2 tuning, proxies), extend the module, not
  the dependency list.
