# ADR 0008 — CSP enforcement is a switch (`CSP_ENFORCE=1`), Trusted Types included

**Status:** accepted (2026-10)

## Context

ADR 0004 shipped the full policy as `Content-Security-Policy-Report-Only` with
nonces + `require-trusted-types-for 'script'`, so real violation data could
accumulate before anything broke. That data is now flowing; the next step is
flipping production to enforcing without turning the switch into a one-way
door mid-incident.

## Decision

`src/middleware.ts` reads `CSP_ENFORCE`:

- unset/`0`: unchanged — minimal enforcing policy + full report-only policy;
- `1`: the **full policy is sent as `Content-Security-Policy`** (nonce,
  `strict-dynamic`, Trusted Types) and the report-only header is dropped.

The flag is evaluated per request, so flipping it is an env change + restart,
reversible in seconds. Violation reports keep POSTing to `/api/report-error`
either way (`csp_violation`).

## Rollout procedure

1. Set `CSP_ENFORCE=1` on one canary container (`canary.sh start`).
2. Watch `csp_violation` counts / REPORT step summary for 24h.
3. Promote; on a spike, unset the flag (no rollback needed for the image).

## Consequences

- Trusted Types violations become real errors when enabled — the client code
  path was already using nonce'd scripts and no `innerHTML` sinks.
- Two policy shapes live in one file; keep them in sync when editing.
