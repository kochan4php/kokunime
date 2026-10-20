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
   - Sanitasi karakter tak kasat mata (_zero-width spaces_, _soft hyphens_, _smart quotes_).
   - Manfaatkan _Exponential Backoff with Random Jitter_ dan _Circuit Breaker_ untuk menangani upstream rate-limiting.

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

Sebelum mengajukan pull request, pastikan seluruh gate berikut lulus:

```bash
pnpm format:check        # 1. Format (Biome)
pnpm lint                # 2. Lint (Biome)
pnpm test                # 3. Unit test (Vitest: project node + dom)
pnpm exec tsc --noEmit   # 4. Type check (strict + exactOptionalPropertyTypes)
pnpm build               # 5. Build produksi
pnpm bundle:budget       # 6. Budget ukuran bundle klien
pnpm size:budget         # 7. Budget ukuran file sumber (maks 450 baris/file)
```

Catatan:

- Test DOM (jsdom) hidup di `tests/{a11y,download-anchors,honeypot-a11y,interactions}`;
  sisanya project `node`. Jalankan satu project: `pnpm test --project node`.
- Budget file (`scripts/file-size-budget.mjs`) gagal bila ada file melebihi 450
  baris — pecah mengikuti pola yang ada (komponen seksi, hook, util).
- Export yang tidak dipakai lagi diperiksa `scripts/find-unused-exports.mjs`;
  jangan biarkan daftar bertambah (de-export atau hapus modulnya).
- Panduan ops (deploy, rollback, backup, incident): `RUNBOOK.md`.

## 📝 Konvensi Commit

Commit mengikuti [Conventional Commits](https://www.conventionalcommits.org/)
— dipakai `scripts/version-bump.mjs` untuk tag semver otomatis:

```
feat(search): tambah filter genre
fix(parser): jangan potong judul dengan tanda hubung
chore(deps): bump vitest
```

- `feat` → minor, `fix`/`perf`/`refactor`/`revert` → patch,
  `!` atau `BREAKING CHANGE` → major.
- Hook `.husky/commit-msg` memvalidasi format (pesan non-conforming ditolak).
- Pre-commit menjalankan lint-staged (format + lint file yang berubah).

---

## 📁 Struktur Direktori Utama

- `src/app/` — Halaman Next.js App Router dan Route Handlers (`/api/*`).
- `src/components/` — Komponen UI modular (cards, anime detail, audio TTS, navigation).
- `src/services/scraper/` — Engine scraper Cheerio dan parser ketahanan data.
- `src/config/upstream.ts` — Modul upstream HTTP fetcher dengan retry & circuit breaker.
- `src/utils/` — Utilitas bookmark, riwayat tontonan, slug formatter, dan history.
- `tests/` — Test suite Vitest dua project (node & jsdom).
- `scripts/` — Ops & quality: deploy/canary/rollback, backup, load test, budget,
  audit unused export, dsb.
- `docs/` — ADR, matriks env, arsitektur, quickstart API.

---

_Terima kasih telah membantu menjadikan Kokunime semakin cepat, stabil, dan bermanfaat bagi komunitas anime Indonesia!_
/
