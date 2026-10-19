# Kokunime

Katalog anime batch dan episode dengan subtitle Indonesia. Kokunime tidak menyediakan player streaming: situs ini mengumpulkan metadata, jadwal rilis dari sumber upstream, dan tautan unduhan per resolusi/mirror, lalu menyajikannya secepat mungkin di web, PWA, dan API publik.

## Fitur

- Katalog anime, genre, musim, tahun, studio, dan halaman update.
- Detail anime: sinopsis, metadata, episode, batch, mirror unduhan, QR, dan ekspor daftar unduhan.
- Pencarian instan + pencarian offline (indeks lokal di perangkat), filter, tag pribadi, bookmark, koleksi, perbandingan, dan roulette.
- PWA: halaman tersimpan offline, pencarian offline, antrean aksi, pembaruan service worker, dan badge inbox.
- API publik REST + GraphQL, OpenAPI, feed RSS/Atom/JSON, sitemap, oEmbed, dan badge status.
- Admin ops: warm-up indeks, revalidasi cache, feature flag, metrics, vitals, slow request, dan status uptime.
- Tanpa iklan, tanpa analytics pihak ketiga, dan tanpa cookie pelacak.

## Menjalankan

Butuh Node.js 22+ dan pnpm.

```bash
pnpm install
pnpm dev
```

Buka `http://localhost:3000`.

Build produksi:

```bash
pnpm build
pnpm start
```

## Environment

| Variable | Wajib | Fungsi |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Tidak | Origin publik untuk canonical, sitemap, Open Graph, dan IndexNow. Default ke URL demo. |
| `REDIS_URL` | Tidak | Cache bersama, rate limit lintas instance, search index, trending, uptime, dan feature flag. Tanpa ini semua fitur turun ke fallback in-memory. |
| `ADMIN_TOKEN` | Tidak | Bearer token untuk endpoint `/api/admin/*`. Kosong = endpoint admin 404. |
| `METRICS_TOKEN` | Tidak | Bearer token untuk `/api/metrics`; fallback token admin. |
| `ERROR_WEBHOOK_URL` | Tidak | Webhook Discord untuk error server/client dan Web Vitals lambat. |
| `CSP_ENFORCE` | Tidak | Set `1` untuk mengubah CSP penuh dari Report-Only menjadi enforcing. |

Detail lengkap ada di [`docs/env.md`](docs/env.md).

## Arsitektur singkat

```text
Browser/PWA -> nginx -> Next.js App Router -> cache (memory -> Redis -> ISR/upstream)
                                      \-> scraper kusonime (fetch-native, retry, circuit breaker)
```

- Server components mengambil data lewat `src/services/scraper/` dan `src/services/cache.ts`.
- Cache berlapis: memory, Redis opsional, `unstable_cache`, lalu upstream.
- Service worker (`public/sw.js`) menangani shell offline, halaman tersimpan, API read-only, dan background sync.
- API publik berada di `src/app/api/`; dokumentasi interaktif ada di `/api`, spesifikasi di `/api/openapi.json`.
- Semua route punya loading boundary yang sesuai; `/offline` sengaja tanpa loading karena menjadi fallback service worker.

## Verifikasi

Gate utama sebelum commit:

```bash
pnpm verify
```

`verify` menjalankan format check, lint, seluruh test, build produksi, gate tanpa pihak ketiga, allowlist dependensi, budget bundle, budget ukuran file, dan pemeriksaan export mati.

Gate browser (butuh Chrome/Edge dan server produksi):

```bash
BASE_URL=http://localhost:3000 pnpm visual:smoke
BASE_URL=http://localhost:3000 pnpm ux:v2
BASE_URL=http://localhost:3000 pnpm a11y:v2
BASE_URL=http://localhost:3000 pnpm seo:v3
```

## Struktur penting

| Path | Isi |
| --- | --- |
| `src/app` | Route App Router, metadata, loading/error boundary, API |
| `src/components` | Komponen UI, termasuk PWA, admin, dan skeleton |
| `src/sections` | Komposisi halaman (home, listing, detail, feed) |
| `src/services/scraper` | Parser dan sumber data upstream |
| `src/lib` | Cache, Redis, rate limit, SEO, observability, keamanan |
| `src/utils` | Util lokal-first: bookmark, koleksi, offline, i18n, QR |
| `tests` | Vitest node + jsdom |
| `scripts` | Gate kualitas, load test, smoke, operasi |
| `docs/adr` | Keputusan arsitektur |

## Batasan yang disengaja

- Tidak ada streaming, komentar, akun cloud, atau iklan.
- Data dapat tertinggal satu TTL; halaman menampilkan status data basi bila terdeteksi.
- Ketersediaan tautan unduhan bergantung pada mirror pihak ketiga; cek berkala tersedia lewat admin.
- Situs ini tidak menyimpan berkas anime dan tidak mengklaim kepemilikan konten.

## Dokumentasi

- [`RUNBOOK.md`](RUNBOOK.md) — operasi, rollback, backup, insiden.
- [`DEPLOY.md`](DEPLOY.md) — deploy Docker/CI.
- [`docs/architecture.md`](docs/architecture.md) — diagram dan alur request.
- [`docs/api-quickstart.md`](docs/api-quickstart.md) — contoh pemakaian API.
- [`docs/adr`](docs/adr) — keputusan teknis.
- [`SECURITY.md`](SECURITY.md) — kebijakan pelaporan keamanan.

Lisensi: lihat [`LICENSE`](LICENSE).
