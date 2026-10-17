# Matriks Environment Variable

Semua variabel opsional: fitur terkait otomatis nonaktif dengan aman saat
nilainya kosong. Validasi format ringan berjalan saat boot
(`src/config/env.ts`, dipanggil `src/instrumentation.ts`) dan hanya menulis
log `env_validation` — tidak pernah mencrash server.

## Aplikasi (runtime)

| Variabel | Wajib | Default | Deskripsi |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Produksi | — | Origin publik (canonical, sitemap, IndexNow, OG). Harus URL http(s) absolut. Build-time. |
| `NEXT_PUBLIC_BUILD_ID` | Tidak | `dev` | Versi aset build untuk invalidasi cache Service Worker. |
| `METRICS_TOKEN` | Tidak | — | Bearer token `/api/metrics`. Kosong → 404. |
| `ADMIN_TOKEN` | Tidak | — | Bearer token `/api/admin/*`. Fallback ke `METRICS_TOKEN`. |
| `ADMIN_ALLOWLIST` | Tidak | — (semua IP) | Daftar IP dipisah koma yang boleh memanggil `/api/admin/*`. |
| `REDIS_URL` | Tidak | — | Cache bersama, pub/sub invalidasi, rate-limit, counter uptime, feature flags. Harus `redis://` / `rediss://`. |
| `ERROR_WEBHOOK_URL` | Tidak | — | Webhook Discord untuk error server/client + alert Web Vitals. |
| `ERROR_REPORT_SAMPLE` | Tidak | `1` | Fraksi 0..1 laporan error client yang diteruskan. |
| `SLOW_REQUEST_MS` | Tidak | `1000` | Ambang log slow-request + ring buffer `/api/admin/slow`. |
| `LOG_LEVEL` | Tidak | `info` | `debug` \| `info` \| `warn` \| `error`. |
| `LOG_FILE` | Tidak | — | Sink file JSONL opsional (server non-serverless). |
| `LOG_MAX_BYTES` | Tidak | `5242880` | Ambang rotasi file log (simpan `.1`–`.3`). |
| `CSP_ENFORCE` | Tidak | `0` | `1` = CSP keluar dari report-only ke enforce + Trusted Types (ADR 0008). |
| `NODE_ENV` | Platform | — | Standar Next.js. |
| `NEXT_RUNTIME` | Platform | — | Diset Next.js (`nodejs` / `edge`); dipakai instrumentation. |

## Scripts & CI (tidak dibaca aplikasi)

| Variabel | Dipakai oleh | Deskripsi |
| --- | --- | --- |
| `BASE`, `BASE_URL`, `SITE_URL`, `PRODUCTION_URL` | validate-cache, e2e-smoke, warm-cache, indexnow, load-test | Target base URL (alias berbeda per script lama). |
| `WARM_LIMIT` | `scripts/warm-cache.mjs` | Jumlah URL sitemap yang dihangatkan (default 50). |
| `LOAD_P95_BUDGET_MS` | `scripts/load-test.mjs` | Budget p95 (default 1500ms). |
| `LOAD_MIN_SUCCESS_RATE` | `scripts/load-test.mjs` | Minimum success rate (default 0.99). |
| `LOAD_SOAK_SECONDS` | `scripts/load-test.mjs` | Durasi mode soak (default 45). |
| `BUNDLE_BUDGET_THRESHOLD` | `scripts/bundle-budget.mjs` | Override budget ukuran bundle (KB). |
| `PARSER_BENCH_BUDGET_MS` | `tests/parser-benchmark.test.ts` | Override budget benchmark parser (default 100 lokal / 300 CI). |
| `ALERT_WEBHOOK_URL`, `DISCORD_WEBHOOK_URL` | `scripts/alert.mjs` | Webhook alert ops; kosong = skip dengan notice. |
| `ALERT_SOURCE` | `scripts/alert.mjs` | Label sumber alert (default `GITHUB_JOB`). |
| `GRAPHIFY_SKIP_HOOK` | Git hook | `1` = lewati regen graphify saat commit. |

## Variabel CI GitHub (repo Settings → Secrets and variables → Actions)

| Nama | Tipe | Deskripsi |
| --- | --- | --- |
| `PRODUCTION_URL` | Variable | URL produksi untuk probe/load/e2e/warm. Kosong → job terkait skip dengan notice. |
| `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_DIR` | Variable | Target SSH deploy (`DEPLOY_DIR` default `/opt/kokunime`). |
| `DEPLOY_SSH_KEY` | Secret | Kunci SSH deploy (tanpa passphrase). |
| `DISCORD_WEBHOOK_URL` | Secret | Webhook alert CI (deploy gagal, probe gagal, nightly gagal). |
