# 🗺️ Master Roadmap & Feature Backlog Kokunime (230+ Ide)

> Dokumen acuan pengembangan menyeluruh untuk platform **Kokunime**. Mencakup arsitektur Scraping Engine, REST API publik, antarmuka Frontend, sistem PWA & Offline, Download Tools, optimasi Performa, SEO, Keamanan, Aksesibilitas (a11y), hingga Pipeline DevOps & Testing.

---

## 📊 Ringkasan Statistik Progres

| No | Pilar Arsitektur | Total Item | Status Selesai | Status Terjadwal |
| :---: | :--- | :---: | :---: | :---: |
| 1 | **Scraping Engine & Upstream Resilience** | 25 | 18 Selesai | 7 Terjadwal |
| 2 | **Public REST API, OpenAPI & Feeds** | 20 | 16 Selesai | 4 Terjadwal |
| 3 | **Frontend UI/UX, Animasi & Komponen** | 25 | 23 Selesai | 2 Terjadwal |
| 4 | **Offline Intelligence, PWA & Local Storage** | 18 | 15 Selesai | 3 Terjadwal |
| 5 | **Download Managers & Media Utilities** | 18 | 16 Selesai | 2 Terjadwal |
| 6 | **Streaming, Video Player & Previews** | 16 | 6 Selesai | 10 Terjadwal |
| 7 | **Performance, Caching & Core Web Vitals** | 18 | 9 Selesai | 9 Terjadwal |
| 8 | **SEO, OpenGraph, Metadata & Rich Snippets** | 16 | 11 Selesai | 5 Terjadwal |
| 9 | **Security, Sanitization & Edge Protection** | 16 | 13 Selesai | 3 Terjadwal |
| 10 | **Accessibility (a11y) & Keyboard Navigation** | 16 | 16 Selesai | 0 Terjadwal |
| 11 | **Internationalization (i18n) & Theming** | 14 | 10 Selesai | 4 Terjadwal |
| 12 | **Testing, QA & Scraper Monitoring** | 16 | 6 Selesai | 10 Terjadwal |
| 13 | **DevOps, CI/CD & Containerization** | 12 | 8 Selesai | 4 Terjadwal |
| **Total** | **Master Backlog** | **230 Item** | **167 Selesai** | **63 Terjadwal** |

---

## 🛠️ Pilar 1: Scraping Engine, Parser & Upstream Resilience (25 Item)

- [x] **001.** Arsitektur HTTP Client Axios untuk Upstream Scraper dengan header peramban lengkap
- [x] **002.** Algoritma Auto-Retry Interceptor Axios dengan penanganan status HTTP 429 dan 5xx
- [x] **003.** Fast-Fail Timeout Protection (10 detik) dan batasan muatan payload 10 MB
- [x] **004.** Multi-Attribute Lazy-Loaded Image Selector (`data-lazy-src`, `data-srcset`, `src`)
- [x] **005.** Protocol-Relative (`//`) dan Relative Path URL Resolver otomatis ke HTTPS
- [x] **006.** Label-Aware Shuffled Metadata Row Parser berbasis deteksi teks dinamis
- [x] **007.** Pembersih karakter tak kasat mata (*zero-width spaces*, *soft hyphens*, *smart quotes*)
- [x] **008.** Regex CJK Character Set (`[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]`) untuk judul asli Jepang
- [x] **009.** YouTube / YouTu.be Embedded Trailer URL Parser
- [x] **010.** Query Traversal Guard, Null-Byte, dan Control Characters Filter
- [ ] **011.** HTML Streaming Parser via Cheerio Stream Mode untuk memangkas lonjakan memori V8
- [ ] **012.** Heuristik Fallback DOM Selector saat markup class WordPress upstream mengalami perubahan
- [ ] **013.** Cloud Mirror Health Auto-Prober untuk mendeteksi link mati / Google Drive limit exceeded
- [ ] **014.** Dukungan header HTTP `ETag` dan `If-None-Match` (304 Not Modified) pada scraper
- [x] **015.** Structured Quality Extractor (`{ height: 720, codec: 'hevc', container: 'mkv' }`)
- [x] **016.** Ekstraksi profil Studio & Produser untuk tautan katalog anime per studio
- [x] **017.** Episode Range Parser untuk judul batch (*"Episode 01 - 12 (End)"* $\rightarrow$ `{ start: 1, end: 12, isEnd: true }`)
- [x] **018.** Pemisah otomatis tabel Batch utuh (1 file zip) dengan tabel download satuan per episode
- [x] **019.** Deteksi otomatis tag audio dan subtitle (*"Dual Audio"*, *"Multi-Sub"*, *"Indo Sub"*)
- [x] **020.** HTML Minifier Stripper sebelum dimuat ke Cheerio (hapus script, style, comments)
- [x] **021.** Ekstraktor ukuran file riil (*FileSize*) ke dalam format integer bytes
- [x] **022.** Deteksi format resolusi adaptif (1080p, 720p, 480p, 360p)
- [x] **023.** Ekstraksi array judul alternatif / alias (*English Title, Romaji, Synonyms*)
- [ ] **024.** Deteksi dan normalisasi format penulisan season rilis
- [x] **025.** Content Warning & Age Rating Detector (`PG-13`, `R-17+`, `R+ Mild Nudity`)

---

## 🌐 Pilar 2: Public REST API, OpenAPI & Feeds (20 Item)

- [x] **026.** `GET /api/health` — Status uptime, latensi scraper (ms), dan metrik memori heap V8
- [x] **027.** `GET /api/random` — Endpoint pengacak anime dengan 307 temporary redirect
- [x] **028.** `GET /api/search?q={query}` — Pencarian judul anime real-time tanpa cache stale
- [x] **029.** `GET /api/genres` — Daftar lengkap seluruh kategori genre anime
- [x] **030.** `GET /api/genres/[genre]?page={page}` — Katalog anime per genre dengan paginasi
- [x] **031.** `GET /api/seasons` — Daftar lengkap musim rilis anime (Winter, Spring, Summer, Fall)
- [x] **032.** `GET /api/seasons/[season]?page={page}` — Katalog anime per musim dengan paginasi
- [x] **033.** `GET /api/anime/[slug]` — Data detail anime (metadata, skor, sinopsis, trailer)
- [x] **034.** `GET /api/anime/[slug]/download` — Daftar link download per resolusi dan platform
- [x] **035.** `GET /feed.xml` — RSS 2.0 XML Feed resmi dengan parameter filter `?genre=` dan `?season=`
- [x] **036.** `GET /api/openapi.json` — Spesifikasi OpenAPI 3.0.3 standar industri
- [x] **037.** Interactive Developer Hub & API Playground interaktif di halaman `/api`
- [x] **038.** Token Bucket IP Rate Limiting (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`)
- [ ] **039.** API Key Authentication Opsional untuk batas request lebih tinggi
- [ ] **040.** `GET /api/graphql` — Endpoint GraphQL untuk sub-query field yang spesifik
- [ ] **041.** Webhook Dispatcher otomatis ke Discord / Telegram saat anime batch baru terbit
- [x] **042.** `POST /api/anime/bulk` — Endpoint batch resolver untuk mengambil 20 anime dalam 1 request
- [x] **043.** Format respons JSON Feed v1.1 di endpoint `/feed.json`
- [x] **044.** Parameter format output kustom (`?format=csv` dan `?format=xml`)
- [ ] **045.** Mock Sandbox Mode di Developer Hub saat server upstream sedang offline

---

## 🎨 Pilar 3: Frontend UI/UX, Animasi & Komponen Modern (25 Item)

- [x] **046.** Floating Navigation Scroll-Spy Table of Contents (`DetailToc`) di halaman detail anime
- [x] **047.** Tombol 1-klik *"Salin Judul"* di header detail anime
- [x] **048.** Tombol Share dengan direct intent popover ke **WhatsApp** dan **X (Twitter)**
- [x] **049.** Rekomendasi anime kontekstual di bagian bawah halaman detail anime
- [x] **050.** Chip filter genre interaktif di atas grid hasil pencarian
- [x] **051.** Pengurutan hasil pencarian (*Relevansi*, *A - Z*, *Z - A*)
- [x] **052.** Floating Back-to-Top Button dengan cincin progres scroll SVG melingkar
- [x] **053.** Web Speech API Native Text-to-Speech (TTS) narator sinopsis bahasa Indonesia
- [x] **054.** Dialog trailer YouTube responsif dengan shortcut keyboard <kbd>T</kbd>
- [x] **055.** Tombol *"🎲 Acak"* di navbar untuk menemukan anime acak instan
- [x] **056.** Badge tautan cerdas ke database eksternal **MyAnimeList** dan **AniList**
- [x] **057.** Micro-animation transisi halus (*Reveal on Scroll*) dengan fallback mode hemat daya
- [x] **058.** Carousel *"Terakhir Dilihat"* di homepage menggunakan `useSyncExternalStore`
- [x] **059.** Header Breadcrumb visual yang sinkron dengan JSON-LD schema
- [x] **060.** Toggle tampilan katalog antara Grid Poster Visual vs Tabel List Ringkas
- [x] **061.** Tooltip Quick Preview saat kursor mouse melayang di atas kartu anime
- [x] **062.** Hero Banner Carousel dinamis untuk anime rating tertinggi musim ini
- [x] **063.** Matriks tabel unduhan multi-kolom (*Resolusi $\times$ Cloud Provider*)
- [x] **064.** Halaman perbandingan anime *side-by-side* di rute `/compare`
- [ ] **065.** Visualisasi garis waktu urutan menonton (*Watch Order Timeline*) untuk franchise panjang
- [ ] **066.** Efek cahaya latar belakang dinamis (*Dominant Color Backdrop Glow*) berbasis gambar poster
- [x] **067.** Filter kombinasi multi-genre dengan logika `AND` / `OR`
- [x] **068.** Indikator status anime *Ongoing* dengan titik hijau berkedip (*Pulsing Dot*)
- [x] **069.** Pengatur ukuran font teks sinopsis (*A- / A+*) untuk kenyamanan membaca
- [x] **070.** Mode fokus membaca (*Reading Focus Mode*) yang menyembunyikan sidebar dan navigasi

---

## 💾 Pilar 4: Offline Intelligence, PWA & Local Storage (18 Item)

- [x] **071.** File manifest PWA native (`manifest.webmanifest`) dengan theme color & icon adaptif
- [x] **072.** PWA App Shortcuts di layar utama (Bookmarks, Anime Acak, Katalog Genre)
- [x] **073.** Status personal watchlist (*Sedang Nonton*, *Rencana Nonton*, *Selesai*)
- [x] **074.** Bar chip filter tab status tontonan di halaman `/bookmarks`
- [x] **075.** Dropdown pemilih status langsung di tombol bookmark header detail anime
- [x] **076.** Ekspor cadangan bookmark ke file JSON
- [x] **077.** Impor cadangan bookmark JSON dengan algoritma *conflict-free auto-merge*
- [x] **078.** Banner deteksi offline otomatis yang mengarahkan ke daftar anime tersimpan lokal
- [x] **079.** Pembuatan folder / playlist custom di menu bookmark (*"Isekai Favorit"*, *"Koleksi Jadul"*, *"Must Watch"*)
- [x] **080.** Fitur rating bintang pribadi (1–10) dan catatan ulasan personal di bookmark
- [ ] **081.** Sinkronisasi otomatis cadangan bookmark ke server WebDAV pribadi
- [ ] **082.** PWA Background Sync untuk memperbarui status rilis anime yang disimpan
- [ ] **083.** Caching halaman detail secara offline via Service Worker untuk 20 anime terakhir
- [x] **084.** Indikator meteran penggunaan kuota penyimpanan LocalStorage / IndexedDB
- [x] **085.** Impor daftar tontonan langsung dari file ekspor XML/JSON MyAnimeList / AniList
- [x] **086.** Ekspor daftar tontonan ke format yang kompatibel dengan MyAnimeList
- [x] **087.** Banner ajakan instalasi PWA non-intrusif dengan penjelasan fitur offline
- [x] **088.** Indeks pencarian instan lokal (Minisearch) untuk mencari anime tersimpan saat offline total

---

## 📥 Pilar 5: Download Managers & Media Utilities (18 Item)

- [x] **089.** 1-klik salin seluruh tautan unduhan ke clipboard
- [x] **090.** 1-klik *"↗ Buka Semua"* untuk membuka seluruh mirror di tab baru dengan proteksi `noopener`
- [x] **091.** 1-klik ekspor format batch **aria2c** (`aria2c -i list.txt`)
- [x] **092.** 1-klik ekspor format tabel **Markdown** untuk dibagikan ke forum / catatan
- [x] **093.** 1-klik ekspor file teks polos (**`.txt`**) untuk download manager
- [x] **094.** 1-klik ekspor file batch **IDM (`.ef2`)** untuk Internet Download Manager
- [x] **095.** 1-klik ekspor script Bash **cURL (`.sh`)** untuk server Linux / VPS
- [x] **096.** Kalkulator estimasi durasi download interaktif (10 Mbps, 50 Mbps, 100 Mbps, 1 Gbps)
- [x] **097.** Salin tautan unduhan terfilter khusus satu provider tertentu (GDrive, Mega, Mediafire, Acefile)
- [x] **098.** Salin tautan unduhan terfilter khusus satu resolusi tertentu (1080p, 720p, 480p)
- [x] **099.** Integrasi tombol *Click'n'Load* dan ekspor file `.dlc` untuk JDownloader 2
- [x] **100.** Label jenis format video dan subtitle (*Softsub MKV* vs *Hardsub MP4*)
- [x] **101.** Badge format kompresi video (*H.264 / AVC* vs *H.265 / HEVC 10-bit*)
- [x] **102.** Deteksi dan parser otomatis *Magnet Link / Torrent Hash* jika tersedia di rilisan batch
- [ ] **103.** Simulator alur panduan langkah unduh bagi pengguna pemula
- [x] **104.** Area teks instan (*Quick-Select Textarea*) yang siap disalin dengan `Ctrl + A`
- [ ] **105.** Deteksi otomatis link cloud mirror yang memerlukan login akun
- [x] **106.** Peringatan visual jika ukuran batch unduhan melebihi 10 GB (Large Batch Warning Badge)

---

## 🎬 Pilar 6: Streaming, Video Player & Previews (16 Item)

- [x] **107.** Pemutar video trailer resmi YouTube dengan modal dialog responsif
- [x] **108.** Protokol sanitasi tautan iframe embed eksternal
- [x] **109.** Pintasan keyboard <kbd>T</kbd> untuk memutar trailer secara cepat
- [ ] **110.** Preview klip video 5 detik saat kursor mouse diarahkan ke poster kartu
- [ ] **111.** Pemutar video HTML5 kustom berbasis Plyr / Video.js untuk embed video langsung
- [x] **112.** Pengatur kecepatan pemutaran trailer video (0.5x, 1x, 1.25x, 1.5x, 2x)
- [ ] **113.** Mode *Picture-in-Picture* (PiP) untuk tetap menonton trailer saat menjelajah katalog
- [x] **114.** Tombol mode bioskop (*Theater Mode*) yang meredupkan tampilan sekitar pemutar video
- [ ] **115.** Deteksi rasio aspek video otomatis (16:9, 4:3, 21:9 ultrawide)
- [ ] **116.** Tombol loncat 10 detik maju / mundur dengan tombol panah keyboard
- [ ] **117.** Pengingat timestamp terakhir video trailer yang ditonton
- [ ] **118.** Pilihan subtitle multisumber pada pemutar video (Indonesia / English)
- [ ] **119.** Slider pengatur volume audio yang tersimpan di LocalStorage
- [x] **120.** Mode layar penuh native (*Fullscreen API*) dengan tombol shortcut <kbd>F</kbd>
- [ ] **121.** Galeri tangkapan layar episode (*Episode Screenshots*) dari rilisan anime
- [ ] **122.** Tombol putar musik tema pembuka (*Opening*) dan penutup (*Ending*) via embed audio

---

## ⚡ Pilar 7: Performance, Caching & Core Web Vitals (18 Item)

- [x] **123.** Zero-Cache Rule pada seluruh katalog realtime (Homepage, Search, Genres, Seasons)
- [x] **124.** Smart Cache TTL Expiration khusus untuk detail anime yang bersifat statis
- [x] **125.** Prioritas format gambar **AVIF** dan fallback **WebP** di `next.config.mjs`
- [x] **126.** Tag `<link rel="preconnect">` dan DNS-Prefetch untuk domain CDN gambar dan YouTube
- [x] **127.** Kompresi payload response HTTP berbasis Gzip & Brotli
- [x] **128.** Partisi Edge Cache Netlify-Vary berdasarkan parameter query halaman
- [x] **129.** Arsitektur token Vanilla CSS zero-runtime tanpa overhead kompilasi JavaScript
- [ ] **130.** Prefetching rute client-side saat kursor mouse mendekati link (prediksi niat 200ms)
- [x] **131.** Upstream Request Coalescing (*Singleflight Pattern*) untuk menggabungkan request konkuren
- [ ] **132.** Virtualized Windowing Scroll untuk katalog dengan ratusan anime agar FPS stabil di 60fps
- [ ] **133.** Critical CSS Inlining pada viewport atas untuk mencapai First Contentful Paint < 0.4s
- [ ] **134.** Font Subsetting untuk memangkas ukuran file Google Fonts menjadi < 15 KB
- [ ] **135.** Tree-shaking modular parser Cheerio untuk merampingkan ukuran bundle serverless
- [ ] **136.** Pembersihan memori (*Garbage Collection*) instan untuk instance DOM parser
- [x] **137.** Header `Cache-Control: public, max-age=31536000, immutable` pada seluruh aset statis
- [ ] **138.** Pengurangan Total Blocking Time (TBT) di bawah 50ms pada perangkat mobile low-end
- [ ] **139.** Penundaan eksekusi script analitik non-kritis menggunakan `requestIdleCallback`
- [ ] **140.** Optimasi Cumulative Layout Shift (CLS) dengan penguncian rasio aspek kontainer gambar

---

## 🔎 Pilar 8: SEO, OpenGraph, Metadata & Rich Snippets (16 Item)

- [x] **141.** Generator gambar banner sosial dinamis di rute `/anime/[slug]/opengraph-image`
- [x] **142.** Twitter Card Metadata dengan tipe `summary_large_image`
- [x] **143.** Schema data terstruktur JSON-LD `BreadcrumbList` dan `WebSite`
- [x] **144.** Sitemap XML otomatis dan dinamis di rute `/sitemap.xml`
- [x] **145.** Konfigurasi file `/robots.txt` dengan crawl-delay yang optimal
- [x] **146.** Penegakan URL Kanonikal absolut di seluruh halaman
- [x] **147.** Schema JSON-LD `TVSeries` dan `Movie` standar Schema.org lengkap dengan `aggregateRating`
- [x] **148.** Schema JSON-LD `FAQPage` untuk memunculkan cuplikan tanya-jawab di hasil pencarian Google
- [ ] **149.** Integrasi protokol WebSub (*PubSubHubbub*) untuk notifikasi instan ke Google Bot saat ada rilis baru
- [ ] **150.** Penanganan otomatis pengalihan 301 (*Moved Permanently*) jika ada slug anime yang berubah
- [x] **151.** Tag bahasa `hreflang="id-ID"` dan `hreflang="x-default"`
- [x] **152.** Meta tag deskripsi dinamis yang merangkum genre, skor, dan jumlah episode secara otomatis
- [ ] **153.** Validasi semantic markup HTML5 100% lolos W3C Validator
- [x] **154.** Integrasi OpenSearch XML Description agar browser mengenali Kokunime sebagai mesin pencari
- [ ] **155.** Indeks kata kunci pencarian populer (*Trending Search Keywords*) di sitemap
- [x] **156.** Rich Snippet indikator ketersediaan download (*DownloadAction* schema)

---

## 🔒 Pilar 9: Security, Sanitization & Edge Protection (16 Item)

- [x] **157.** Content Security Policy (CSP) ketat (`base-uri 'none'`, `form-action 'self'`, `object-src 'none'`)
- [x] **158.** Header proteksi `X-Content-Type-Options: nosniff`
- [x] **159.** Header proteksi `Referrer-Policy: strict-origin-when-cross-origin`
- [x] **160.** Header proteksi `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- [x] **161.** Header proteksi HSTS `Strict-Transport-Security` dengan max-age 2 tahun
- [x] **162.** Filter pembersih Null-Byte, Path Traversal (`../`), dan karakter kontrol pada pencarian
- [x] **163.** Pembatasan batas atas ukuran muatan respon upstream (*Maximum 10 MB Ceiling*)
- [x] **164.** Sanitasi karakter input terhadap potensi mutasi XSS
- [x] **165.** Proteksi SSRF (*Server-Side Request Forgery*) dengan validasi whitelist domain upstream
- [x] **166.** Penyamaran otomatis pesan error internal (*Stack Trace Masking*) di lingkungan produksi
- [ ] **167.** Tautan jebakan bot tak kasat mata (*Honeypot Traps*) untuk memblokir crawler liar
- [ ] **168.** Validasi header `Origin` dan `Sec-Fetch-Site` pada seluruh endpoint mutasi
- [x] **169.** Pembatasan jumlah karakter maksimum pada input query pencarian (maks 80 karakter)
- [x] **170.** Sanitasi tautan unduhan sebelum ditampilkan untuk memblokir skema URI `javascript:` atau `data:`
- [ ] **171.** Pemblokiran request dari User-Agent scraper berbahaya yang teridentifikasi
- [x] **172.** Header `Cross-Origin-Opener-Policy: same-origin` untuk isolasi proses tab peramban

---

## ♿ Pilar 10: Accessibility (a11y) & Keyboard Navigation (16 Item)

- [x] **173.** Tautan navigasi aksesibel *"Lompat ke konten utama"* (<kbd>Tab</kbd> $\rightarrow$ `<a href="#konten">`)
- [x] **174.** Pemicu Command Palette global dengan keyboard (<kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> / <kbd>/</kbd>)
- [x] **175.** Tombol pintas cepat lompat ke bagian download (<kbd>D</kbd>)
- [x] **176.** Tombol pintas cepat membuka trailer video (<kbd>T</kbd>)
- [x] **177.** Tombol pintas cepat membuka anime acak (<kbd>R</kbd>)
- [x] **178.** Modal panduan daftar tombol pintas keyboard interaktif (<kbd>?</kbd>)
- [x] **179.** Pengumuman status dinamis via `aria-live="polite"` saat tautan disalin atau disimpan
- [x] **180.** Hierarki heading semantik yang teratur (hanya satu `<h1>` per halaman)
- [x] **181.** Navigasi panah keyboard (<kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd>) untuk berpindah antar kartu anime
- [x] **182.** Pengatur kecepatan audio TTS pembaca sinopsis (0.75x, 1x, 1.25x, 1.5x)
- [x] **183.** Mode tema kontras tinggi (*OLED High-Contrast Black*) untuk pengguna dengan gangguan penglihatan
- [x] **184.** Cincin fokus keyboard kontras tinggi (*Focus-Visible Ring*) pada seluruh elemen interaktif
- [x] **185.** Kepatuhan aturan mode hemat gerak sistem operasi (`prefers-reduced-motion: reduce`)
- [x] **186.** Standar rasio kontras warna teks minimum 7:1 sesuai panduan WCAG AAA
- [x] **187.** Area sentuh minimum tombol pada perangkat mobile sebesar 48x48 piksel
- [x] **188.** Label teks alternatif deskriptif pada seluruh elemen grafis dan ikon SVG

---

## 🌍 Pilar 11: Internationalization (i18n) & Theming (14 Item)

- [x] **189.** Tema gelap (*Dark Mode*) dan terang (*Light Mode*) dengan transisi warna halus
- [x] **190.** Deteksi preferensi tema otomatis dari sistem operasi (`prefers-color-scheme`)
- [x] **191.** Pencegahan kedipan tema (*Theme Flashing FOUC*) menggunakan inline script head
- [ ] **192.** Pengalih bahasa antarmuka (Bahasa Indonesia & English)
- [x] **193.** Pilihan tema aksen warna kustom (Emerald, Violet, Sunset Amber, Rose, Cyberpunk Cyan)
- [x] **194.** Format penanggalan rilis anime terlokalisasi (misal *"18 Agustus 2026"*)
- [x] **195.** Konversi penulisan angka desimal skor dan separator ribuan sesuai lokal Indonesia
- [x] **196.** Terjemahan otomatis istilah genre ke bahasa Indonesia (misal: *Sci-Fi* $\rightarrow$ *Fiksi Ilmiah*)
- [x] **197.** Pengaturan opsi tema AMOLED Black murni untuk layar smartphone hemat baterai
- [x] **198.** Sinkronisasi preferensi tema lintas tab menggunakan storage listener
- [ ] **199.** Opsi pemilihan jenis font tampilan (Sans Modern, Monospace Retro, Serif Editorial)
- [ ] **200.** Dukungan teks orientasi vertikal untuk judul asli beraksara Jepang
- [ ] **201.** Mode peredup layar otomatis saat malam hari (*Night Shift Tint*)
- [x] **202.** Penyimpanan seluruh konfigurasi preferensi tampilan di LocalStorage

---

## 🧪 Pilar 12: Testing, QA & Scraper Monitoring (16 Item)

- [x] **203.** Unit test suite Vitest dengan 66 test case di 18 file pengujian
- [x] **204.** File mock HTML fixture untuk pengujian unit offline tanpa ketergantungan jaringan
- [x] **205.** Suite pengujian ketahanan parser scraper (*Lazy Image, CJK Title, Entities, URL Resolver*)
- [x] **206.** Konfigurasi linting ESLint ketat (0 error, 0 warning)
- [x] **207.** Pengujian otomatis format ekspor backup bookmark JSON
- [ ] **208.** GitHub Actions Daily Scheduled CI untuk memvalidasi kesehatan scraper upstream
- [ ] **209.** Suite End-to-End Visual Regression Testing menggunakan Playwright
- [ ] **210.** Audit skor Lighthouse CI otomatis (Target: Performance 100, Accessibility 100, SEO 100)
- [x] **211.** Benchmark suite untuk mengukur latensi pemrosesan parser Cheerio dalam milidetik
- [ ] **212.** Pengujian integritas skema respons seluruh endpoint API menggunakan Zod
- [ ] **213.** Pengujian beban (*Load Testing*) simulasi 500 request per detik menggunakan k6
- [ ] **214.** Pemantauan uptime dan latensi API publik menggunakan UptimeRobot / BetterUptime
- [ ] **215.** Notifikasi otomatis ke Telegram / Discord jika scraper mengalami kegagalan beruntun
- [ ] **216.** Pengujian kompatibilitas lintas peramban (Chrome, Safari iOS, Firefox, Samsung Internet)
- [ ] **217.** Pelaporan cakupan kode (*Code Coverage*) dengan target minimum 85%
- [ ] **218.** Pengujian fungsionalitas tombol pintas keyboard di berbagai layout papan ketik

---

## 🚀 Pilar 13: DevOps, CI/CD & Containerization (12 Item)

- [x] **219.** Target kompilasi Next.js Standalone Build (`output: "standalone"`) untuk portabilitas deployment
- [x] **220.** Pengoptimalan konfigurasi build Turbopack Next.js 16
- [x] **221.** Dockerfile multi-stage minimalis berbasis Alpine Linux dengan ukuran image < 120 MB
- [x] **222.** File konfigurasi `docker-compose.yml` lengkap dengan health check pada `/api/health`
- [x] **223.** GitHub Actions Workflow untuk build dan pengujian CI/CD (`.github/workflows/ci.yml`)
- [ ] **224.** Konfigurasi otomatis deploy preview branch di Netlify / Vercel
- [x] **225.** Script instalasi dan inisialisasi lingkungan dev satu perintah (`npm run setup`)
- [x] **226.** Integrasi `@next/bundle-analyzer` untuk audit ukuran bundle JavaScript sebelum rilis
- [ ] **227.** Generator changelog dan rilis versi otomatis berbasis *Conventional Commits*
- [ ] **228.** Konfigurasi auto-restart container menggunakan healthcheck Docker
- [ ] **229.** Konfigurasi script backup berkala untuk data cache lokal
- [x] **230.** Dokumentasi panduan kontribusi open-source (`CONTRIBUTING.md`)

---

*Dokumen ROADMAP.md ini diperbarui secara berkala seiring berjalannya siklus rilis dan pengembangan fitur baru di Kokunime.*
