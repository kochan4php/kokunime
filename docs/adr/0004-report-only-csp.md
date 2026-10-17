# ADR 0004 — CSP ships Report-Only, with nonce and Trusted Types in the policy

**Status:** accepted (2026-10)

## Context

Next.js App Router needs inline scripts (theme bootstrap, RSC payload
flushing), which historically forced `'unsafe-inline'`. A full enforcing CSP
would break the site; shipping none would leave `base-uri`, `form-action`,
and XSS sinks unobserved.

## Decision

Two headers, both from `src/middleware.ts` + `next.config.mjs`:

1. **Enforcing, minimal:** `Content-Security-Policy: base-uri 'none';
   form-action 'self'; object-src 'none'` — these directives cannot break
   Next's inline bootstrapping.
2. **Report-only, full:** every request gets a fresh nonce; the policy lists
   `'nonce-…'` + `'strict-dynamic'` alongside the current allowances, plus
   `require-trusted-types-for 'script'` and
   `trusted-types default`. Violations POST to `/api/report-error` and are
   counted as `csp_violation`.

Middleware stamps the nonce onto the request so Next can attach it to its
scripts; the same policy goes out as `Content-Security-Policy-Report-Only`.

## Consequences

- Real violation data accumulates before any enforcing pass; the enforcing
  change becomes data-driven, not a guess.
- Unknown future inline scripts get logged instead of blocked — acceptable
  because the site never accepts untrusted HTML.
