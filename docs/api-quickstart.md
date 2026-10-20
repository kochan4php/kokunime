# 🚀 API Quickstart

Base URL: `https://<host>` (docs interaktif + live tester: halaman `/api`;
spesifikasi mesin: `/api/openapi.json`).

Semua respons JSON kecuali disebut lain. Error memakai RFC 9457
(`application/problem+json`):

```json
{
  "type": "https://httpstatuses.io/429",
  "title": "Too Many Requests",
  "status": 429,
  "detail": "Too many requests. Please slow down.",
  "error": "Too many requests. Please slow down.",
  "requestId": "…"
}
```

Rate limit: header `X-RateLimit-Limit` / `X-RateLimit-Remaining` /
`X-RateLimit-Reset` di setiap respons; saat circuit upstream terbuka limit
otomatis mengetat (data stale tetap disajikan).

## 1. Cari anime

```bash
curl "https://<host>/api/search?q=naruto"
curl "https://<host>/api/suggest?q=nar"   # autocomplete, butuh ≥2 karakter
```

`suggest` bisa dimatikan operator via feature flag (`/api/admin/flags`) dan
akan menjawab daftar kosong — perlakukan sebagai "tidak ada saran".

## 2. Detail, episode, link download

```bash
curl "https://<host>/api/anime/one-piece"
curl "https://<host>/api/anime/one-piece/episodes"
curl "https://<host>/api/anime/one-piece/download"
```

## 3. Jelajah katalog

```bash
curl "https://<host>/api/genres"
curl "https://<host>/api/genres/action"
curl "https://<host>/api/seasons"
curl "https://<host>/api/seasons/fall-2025"
curl "https://<host>/api/random"
curl "https://<host>/api/trending"
```

## 4. GraphQL (pengganti resmi `/api/anime/bulk`)

```bash
curl -X POST "https://<host>/api/graphql" \
  -H "content-type: application/json" \
  -d '{"query":"{ anime(slug: \"one-piece\") { title score image } }"}'
```

Query yang didukung: `anime(slug: "<slug>") { title score image … }` dan
`genres`. Field di luar record detail akan diabaikan. APQ (Automatic
Persisted Queries) didukung: kirim `{ "extensions": { "persistedQuery": {
"sha256Hash": "…" } } }` untuk query yang sudah pernah dikirim.

## 5. Bulk (deprecated — tetap hidup sampai 16 Apr 2027)

`POST /api/anime/bulk` membalas header `Deprecation`, `Sunset`, dan
`Link: <…/api/graphql>; rel="successor-version"`. Migrasikan ke GraphQL.

## 6. Laporan data

Kirim laporan tanpa URL bebas. `kind`: `dead_link`, `missing_episode`, atau
`metadata`; `note` opsional (maks. 300 karakter, tanpa tautan). Endpoint
memakai rate limit + honeypot dan menyimpan ke antrean Redis; tanpa Redis
jawabannya `503` (bukan sukses palsu).

```bash
curl -X POST "https://<host>/api/report" \
  -H "content-type: application/json" \
  -d '{"slug":"one-piece","kind":"dead_link","note":"server 720p tidak bisa dibuka"}'
```

## 7. Endpoint ops (tanpa auth)

| Endpoint | Isi |
| --- | --- |
| `/api/live` | Liveness ringan (container kesehatan). |
| `/api/ready` | Kesiapan + dependensi (Redis/upstream) ringkas. |
| `/api/health` | Health upstream + circuit + metrik scraper. |
| `/api/status` | Snapshot operasional (memori, event loop, uptime, Redis) — 503 saat degraded. |
| `/api/badge.svg` | Badge status untuk README. |

Endpoint admin (`/api/admin/*`, `/api/metrics`) butuh
`Authorization: Bearer <ADMIN_TOKEN|METRICS_TOKEN>`; tanpa token terkonfigurasi
mereka membalas 404. Halaman `/status` menampilkan uptime publik 14 hari dan
ringkasan Web Vitals in-memory (sampel 20% sesi, sejak proses start).

## Etika pemakaian

Cache respons di sisi Anda (`Cache-Control` sudah informatif), jangan polling
di bawah interval rate limit, dan sertakan `User-Agent` yang jelas untuk bot.
