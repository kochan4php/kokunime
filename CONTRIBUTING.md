# 🤝 Panduan Kontribusi Kokunime (Contributing Guide)

Terima kasih telah tertarik untuk berkontribusi pada pengembangan **Kokunime**! Dokumen ini menjelaskan standar arsitektur, aturan caching, pipeline pengujian, dan alur kerja pengembangan.

---

## 🏗️ Prinsip Arsitektur (Ponytail Ultra)

1. **Zero Unrequested Abstractions:** Gunakan fitur bawaan platform (Web Standard API, Next.js App Router, CSS native) sebelum menambahkan library eksternal baru.
2. **Aturan Caching Ketat (Zero-Cache Rule):**
   - **Katalog Realtime:** Daftar anime terbaru (`/`), pencarian (`/search`), genre (`/genres`), dan musim (`/seasons`) **TIDAK BOLEH DICACHE** agar pengguna selalu mendapatkan data terbaru secara real-time.
   - **Detail Anime:** Data detail anime (`/anime/[slug]`) di-cache dengan smart TTL (`TTL.detail` = 15 menit) via `unstable_cache`.
3. **Resiliensi Scraper:**
   - Gunakan parser berbasis label teks (bukan hardcoded index array).
   - Sanitasi karakter tak kasat mata (*zero-width spaces*, *soft hyphens*, *smart quotes*).
   - Manfaatkan *Exponential Backoff with Random Jitter* dan *Circuit Breaker* untuk menangani upstream rate-limiting.

---

## 🚀 Setup Lingkungan Pengembangan

1. **Clone repository:**
   ```bash
   git clone https://github.com/kochan4php/kokunime.git
   cd kokunime
   ```

2. **Inisialisasi & Verifikasi Otomatis:**
   ```bash
   pnpm setup
   ```

3. **Jalankan Server Development:**
   ```bash
   pnpm dev
   ```
   Buka `http://localhost:3000` di peramban Anda.

---

## 🧪 Pengujian & Standar Kualitas

Sebelum mengajukan pull request, pastikan seluruh pipeline berikut lulus:

```bash
# 1. Jalankan Unit Tests
pnpm test

# 2. Jalankan Linter ESLint
pnpm lint

# 3. Validasi Format Kode Prettier
pnpm prettier:check

# 4. Uji Kompilasi Produksi
pnpm build
```

---

## 📁 Struktur Direktori Utama

* `src/app/` — Halaman Next.js App Router dan Route Handlers (`/api/*`).
* `src/components/` — Komponen UI modular (cards, anime detail, audio TTS, navigation).
* `src/services/scraper/` — Engine scraper Cheerio dan parser ketahanan data.
* `src/config/upstream.ts` — Modul upstream HTTP fetcher dengan retry & circuit breaker.
* `src/utils/` — Utilitas bookmark, riwayat tontonan, slug formatter, dan history.
* `tests/` — Test suite Vitest untuk parser, unit resilience, dan API.

---

*Terima kasih telah membantu menjadikan Kokunime semakin cepat, stabil, dan bermanfaat bagi komunitas anime Indonesia!*
/