# Dependensi

Kebijakan: **standar platform dulu** (Web API, Next.js App Router, Node
built-in) sebelum menambah paket. Dependency runtime baru butuh alasan kuat +
ADR; devDependency baru harus menggantikan sesuatu atau menutup gap yang jelas.

## Runtime (`dependencies`)

| Paket | Peran | Catatan |
| --- | --- | --- |
| `next` (16) | Framework App Router, route handler, ISR, image optimization | Sumber utama fitur; lihat ADR 0006 untuk batas caching. |
| `react`, `react-dom` (19) | UI runtime | Server Components + client islands. |
| `cheerio` | Parsing HTML upstream (scraper) | Satu-satunya parser HTML; jangan tambah parser kedua. |
| `redis` (v6) | Cache tier bersama opsional | Semua fitur Redis punya fallback in-memory — ADR 0002. |
| `sharp` | Image optimization Next.js + generator ikon/OG | Dipakai runtime oleh `next/image`; jangan dihapus dari production image. |
| `husky` | Git hooks (lint-staged, commit-msg) | Tooling — berada di `dependencies` karena legacy; kandidat pindah ke devDependencies. |

Tidak ada lagi: `axios` (diganti fetch native — ADR 0007), `eslint` +
`prettier` (diganti Biome), library coverage/analisis bundle eksternal
(script sendiri di `scripts/`).

## Development (`devDependencies`)

| Paket | Peran |
| --- | --- |
| `typescript` | Type checking (`pnpm exec tsc --noEmit`); strict + `exactOptionalPropertyTypes`. |
| `vitest` + `jsdom` | Test runner dua project (node & dom) — ADR 0010. |
| `@biomejs/biome` | Format + lint (pengganti eslint/prettier). |
| `tailwindcss` + `@tailwindcss/postcss`, `postcss` | Styling. |
| `@types/node`, `@types/react`, `@types/react-dom` | Tipe. |
| `axe-core` | Audit a11y di test DOM. |
| `lint-staged` | Pre-commit hanya menyentuh file yang berubah (runner chunk di `scripts/lint-staged-chunk.mjs`). |

## Audit & update

- `pnpm audit` di CI (butuh jaringan; gagal jaringan → tetap lolos dengan notice).
- `node scripts/check-licenses.mjs` — memastikan lisensi aman untuk rilis.
- Update paket: satu PR per kelompok (framework / tooling / tipe), jalankan
  gate penuh (`format:check`, `lint`, `test`, `build`, budget) sebelum merge.
