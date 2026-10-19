# Security Policy

## Supported versions

Kokunime is deployed continuously from the `main` branch. Security fixes are
applied to the current production build; older image tags do not receive
backports.

## Reporting a vulnerability

Please do **not** open a public issue for a vulnerability that could expose
users, tokens, or infrastructure.

Use GitHub's private vulnerability reporting for
[kochan4php/kokunime](https://github.com/kochan4php/kokunime/security/advisories/new).
If that is unavailable, contact the maintainer through the channel listed at
`/.well-known/security.txt` and [`/privacy`](https://kokunime.netlify.app/privacy).

Include:

- affected route, endpoint, or component;
- reproduction steps or a minimal proof of concept;
- impact and whether user data or admin tokens are involved;
- the commit or image tag where you observed it, if known.

We aim to acknowledge reports within 3 business days. Please give us a
reasonable window to ship a fix before public disclosure.

## Scope

In scope:

- authentication/authorization on `/api/admin/*` and `/api/metrics`;
- SSRF or redirect bypass in scraper/webhook/image handling;
- XSS, CSP bypass, prototype pollution, or unsafe HTML rendering;
- cache poisoning, data leakage, or cross-user data exposure;
- rate-limit bypass that enables abuse of upstream or webhooks;
- dependency vulnerabilities reachable from the production runtime.

Out of scope:

- upstream kusonime availability, content accuracy, or mirror file contents;
- reports that require a compromised browser, extension, or root access;
- missing security headers that are already documented as intentional;
- automated scanner output without a reproducible impact.

## Security defaults

- No third-party scripts, analytics, or ad networks.
- Admin endpoints are hidden (404) when no token is configured, use
  timing-safe token comparison, optional IP allowlist, and lockout.
- Outbound URLs from configuration pass through an SSRF/redirect guard.
- CSP ships as Report-Only by default; production can enforce it with
  `CSP_ENFORCE=1` after the violation stream is clean.
- Secrets are read from environment variables and never committed; CI runs a
  secret scan and a production dependency audit.
- Service worker caching never caches mutations or authenticated responses.

## Operator checklist

- [ ] `ADMIN_TOKEN` and `METRICS_TOKEN` are long, random, and different.
- [ ] `ADMIN_ALLOWLIST` is set when the admin surface is publicly reachable.
- [ ] `CSP_ENFORCE=1` has been canaried and the report stream is clean.
- [ ] `ERROR_WEBHOOK_URL` points to a private channel; rotate it if leaked.
- [ ] Dependencies are updated through the normal `pnpm verify` gate.
- [ ] Backups are verified and restore drills are performed quarterly.
