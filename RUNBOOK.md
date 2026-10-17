# 🚑 RUNBOOK — Kokunime Operations

Panduan operasional produksi. Semua script di `scripts/` dijalankan dari root
repo kecuali disebut lain (deploy/canary/rollback berjalan **di server deploy**,
se-direktori dengan `docker-compose.prod.yml`).

Komponen: container app (`kokunime-app`) → nginx (microcache 1s + weighted
canary) → upstream kusonime. Redis opsional (cache tier, rate-limit, counter
uptime, feature flags). Monitoring: GitHub Actions (`monitor`, `nightly`,
`drill`) + webhook Discord opsional.

---

## 1. Deploy normal

Otomatis: push ke `main` → workflow `deploy` → build image `sha-xxxxxxx` →
`scripts/deploy.sh` (health-gate `/api/live`, auto-rollback 120 detik) →
smoke e2e → warm cache 50 URL.

Manual di server:

```bash
./deploy.sh sha-1a2b3c4     # pull tag + restart + health gate + auto-rollback
```

## 2. Canary bertahap (opsional)

```bash
./canary.sh start sha-1a2b3c4 2   # 2/10 trafik ke canary (port 3001)
./canary.sh watch 5               # gate 5 menit: gagal 3x probe → auto-abort,
                                  # bersih sampai selesai → auto-promote
./canary.sh promote sha-1a2b3c4   # promote manual
./canary.sh abort                 # buang canary, stable ambil semua trafik
```

Status canary dipantau lewat `http://localhost:3001/api/live` (liveness saja —
upstream dipantau terpisah).

## 3. Rollback

```bash
./rollback.sh sha-1a2b3c4   # kembali ke tag lama + health gate; gagal → balik lagi
```

Image sebelumnya: `docker inspect -f '{{.Config.Image}}' kokunime-app`.
Manual paling cepat: `KOKUNIME_TAG=sha-lama docker compose -f docker-compose.prod.yml up -d`.

Setelah rollback: catat kejadian, cek `/api/status`, `/api/health`,
`/api/admin/slow`, dan log container (`docker logs kokunime-app --tail 200`).

## 4. Backup & restore

```bash
node scripts/backup-cache.mjs            # snapshot gzip + .sha256 (retensi 14 terbaru)
node scripts/backup-cache.mjs --dry-run  # lihat rencana tanpa menulis
node scripts/backup-cache.mjs --verify   # checksum + umur snapshot terbaru (<7 hari)
node scripts/backup-cache.mjs --restore [file]  # tulis balik ke Redis (butuh REDIS_URL)
```

Drill mingguan otomatis (`drill.yml`, Senin 03:17 UTC) membuat snapshot baru
lalu memverifikasi checksum. Backup tanpa Redis tetap valid (metadata saja).
**Uji restore** ke Redis staging minimal sekali per kuartal.

## 5. Monitoring & alert

| Workflow | Jadwal | Isi |
| --- | --- | --- |
| `monitor` | 15 menit | `/api/live` + latency, `/api/health`, rute kritis, TLS expiry (<14 hari = gagal) |
| `monitor` | 6 jam | e2e smoke production |
| `nightly` | Harian 02:23 UTC | integritas cache, load gate quick, breakpoint (info), staging compose + e2e, size/hardening image |
| `drill` | Senin 03:17 UTC | backup + verifikasi checksum |

Alert: set secret `DISCORD_WEBHOOK_URL` (atau `ALERT_WEBHOOK_URL`); semua job
memanggil `scripts/alert.mjs` dan **skip dengan notice** bila webhook kosong.
Halaman status publik: `/status` (rollup 14 hari, ISR 5 menit, butuh Redis).

## 6. Load & chaos

```bash
node scripts/load-test.mjs --mode=quick  https://<host>/api/live   # gate rilis
node scripts/load-test.mjs --mode=spike  https://<host>/api/live   # burst tinggi
node scripts/load-test.mjs --mode=soak   https://<host>/api/live   # sustained
node scripts/load-test.mjs --mode=breakpoint https://<host>/api/live  # cari titik pecah
```

Budget: `LOAD_P95_BUDGET_MS` (default 1500) & `LOAD_MIN_SUCCESS_RATE` (0.99).
Chaos in-process: `pnpm vitest run tests/chaos.test.ts` (Redis mati, circuit
open, latency injection, eviction storm). Jalankan kedua suite ini sebelum
perubahan besar di cache/upstream.

## 7. Feature flags

Buka `/admin`, isi token, klik **Feature flags** lalu toggle. Flag tersimpan di
Redis (`feature-flags`); tanpa Redis toggle berlaku in-memory sampai restart.
Flag saat ini: `suggest` (autocomplete), `report-vitals` (RUM). Kill switch
tanpa redeploy.

## 8. Cache

- Microcache nginx 1 detik untuk HTML (header `X-Cache-Status`), `/api/*` tidak
  pernah di-cache. Konfigurasi digenerate `canary.sh` (seed: `deploy/nginx/canary.conf`).
- Tier aplikasi: lihat `docs/adr/0001-cache-tiers.md`; Redis opsional
  (`docs/adr/0002-optional-redis.md`).
- `node scripts/validate-cache.mjs` (harian di nightly) memverifikasi wiring cache live.

## 9. Release & tag

- Tag `v*` → GitHub Release otomatis (`release.yml` + `scripts/release-changelog.mjs`).
- Tag semver otomatis dari conventional commits: jalankan workflow **Release**
  via `workflow_dispatch` job `bump`, atau lokal:

```bash
pnpm version:bump            # dry-run: tampilkan bump yang akan dibuat
pnpm version:bump --write    # commit chore(release) + tag vX.Y.Z (lalu push --tags)
```

## 10. Incident checklist (5 menit pertama)

1. Cek `/status`, `/api/status`, `/api/health` — live atau degraded?
2. `monitor` run terakhir + step summary (liveness/latency/rute/TLS).
3. Bila upstream down (circuit open): rate limit otomatis mengetat, cache stale
   disajikan; **jangan** rollback selama app sehat.
4. Bila app sendiri yang gagal: `./rollback.sh <tag-sebelumnya>`.
5. Redis down: fitur degradasi in-memory otomatis; restart Redis lalu
   `node scripts/backup-cache.mjs --verify`.
6. Catat dampak + timeline; buat issue/ADR bila perlu perubahan permanen.
