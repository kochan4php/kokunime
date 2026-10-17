# Deployment

Pipeline: `push to main` → GitHub Actions (`deploy.yml`) → build image → push to GHCR → SSH to server → `scripts/deploy.sh` (health-gated, auto-rollback).

## Repository configuration

Set these on GitHub → Settings → Secrets and variables → Actions:

| Type     | Name                  | Value                                                    |
| -------- | --------------------- | -------------------------------------------------------- |
| Variable | `PRODUCTION_URL`      | `https://your-domain.tld` (no trailing slash)            |
| Variable | `DEPLOY_HOST`         | Server hostname/IP (leave unset to disable the deploy job) |
| Variable | `DEPLOY_USER`         | SSH user (defaults to `root`)                            |
| Variable | `DEPLOY_DIR`          | Server dir (defaults to `/opt/kokunime`)                 |
| Secret   | `DEPLOY_SSH_KEY`      | Private key allowed to SSH into the server               |
| Secret   | `DISCORD_WEBHOOK_URL` | Webhook for uptime/canary/deploy alerts (optional)       |

Also used by the `Monitor` workflow (`monitor.yml`): `PRODUCTION_URL` every 15 min for `/api/health`, plus a 6-hourly e2e smoke canary.

## Server prerequisites

- Docker + Docker Compose v2.
- GHCR access: make the package **public** (packages → kokunime → visibility) so the server can pull without credentials. Otherwise run `docker login ghcr.io` on the server first.
- Optional `.env` in `DEPLOY_DIR` for runtime config: `NEXT_PUBLIC_SITE_URL`, `ERROR_WEBHOOK_URL`, `REDIS_URL` (see `.env.example`).
- Optional shared cache: `docker compose -f docker-compose.prod.yml --profile cache up -d` then set `REDIS_URL=redis://kokunime-redis:6379` for the app service (add it to the compose `environment` or a `.env` file next to the compose file).

## Manual deploy / rollback

```bash
# On the server:
cd /opt/kokunime
KOKUNIME_TAG=sha-abcd1234 docker compose -f docker-compose.prod.yml up -d
./deploy.sh sha-abcd1234        # health-gated variant, auto-rollback on failure
```

Rollback = run `deploy.sh` with the previous tag, or `docker compose -f docker-compose.prod.yml up -d` while `KOKUNIME_TAG` points at the old image.

## SEO ping

After a deploy, `scripts/indexnow.mjs` submits the sitemap URLs to IndexNow (best effort, `SITE_URL` env). Locally: `SITE_URL=https://your-domain.tld pnpm indexnow`.
