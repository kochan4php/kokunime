import MainLayout from "@/layouts/main-layout";
import ApiTester, { ApiEndpoint } from "@/components/api-tester";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Developer REST API & GraphQL · Kokunime Hub",
  description:
    "Dokumentasi publik REST API & GraphQL Kokunime untuk bot Discord/Telegram, aplikasi mobile, dan automasi.",
  alternates: {
    canonical: `${SITE_URL}/api`,
  },
  openGraph: {
    title: "Developer REST API & GraphQL · Kokunime Hub",
    description: "Dokumentasi publik REST API & GraphQL Kokunime untuk integrasi pihak ketiga.",
    url: `${SITE_URL}/api`,
  },
};

const ENDPOINTS: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/health",
    category: "General",
    description: "Cek uptime server, latensi koneksi upstream (ms), dan status operasional sistem scraper.",
    sampleUrl: "/api/health",
  },
  {
    method: "GET",
    path: "/api/status",
    category: "General",
    description:
      "Snapshot ringkas tanpa auth: status ok/degraded (503 saat degraded), uptime, memori, event-loop lag, circuit upstream, Redis.",
    sampleUrl: "/api/status",
  },
  {
    method: "GET",
    path: "/api/admin/index",
    category: "General",
    description:
      "Status local search index (size, Redis) dengan Bearer ADMIN_TOKEN/METRICS_TOKEN. Warm-up via POST {pages,genres}. Tanpa token terkonfigurasi → 404.",
    sampleUrl: "/api/admin/index",
    paramsDescription: "Authorization: Bearer <ADMIN_TOKEN|METRICS_TOKEN>",
  },
  {
    method: "GET",
    path: "/api/metrics",
    category: "General",
    description:
      "Snapshot Prometheus text (counter, histogram latensi, status circuit upstream, Redis). Hanya aktif bila METRICS_TOKEN diisi.",
    sampleUrl: "/api/metrics",
    paramsDescription: "Authorization: Bearer <METRICS_TOKEN>",
  },
  {
    method: "GET",
    path: "/api/random",
    category: "General",
    description: "Mendapatkan dan mengarahkan (307 redirect) secara acak ke salah satu anime di katalog.",
    sampleUrl: "/api/random",
  },
  {
    method: "GET",
    path: "/api/search?q={query}",
    category: "Catalog",
    description:
      "Pencarian anime real-time ke upstream scraper, ditambah local catalog index (fuzzy) dan query syntax: `genre:action,adventure`, `-kata` untuk exclude, `fields=title,link` untuk proyeksi atribut.",
    sampleUrl: "/api/search?q=naruto",
    defaultParam: { key: "q", value: "naruto", placeholder: "kata kunci pencarian..." },
    paramsDescription: "q: string (min 2 karakter) · fields: title,release,genres,link",
  },
  {
    method: "GET",
    path: "/api/suggest?q={query}",
    category: "Catalog",
    description:
      "Autocomplete hingga 8 judul dari local catalog index — tanpa upstream call. Kosong saat index belum di-warm-up.",
    sampleUrl: "/api/suggest?q=naruto",
    defaultParam: { key: "q", value: "naruto", placeholder: "kata kunci..." },
    paramsDescription: "q: string (min 2 karakter)",
  },
  {
    method: "GET",
    path: "/api/genres",
    category: "Catalog",
    description: "Mengambil daftar lengkap seluruh kategori genre anime yang tersedia di katalog Kokunime.",
    sampleUrl: "/api/genres",
  },
  {
    method: "GET",
    path: "/api/genres/{genre}",
    category: "Catalog",
    description: "Mengambil daftar anime berdasarkan kategori genre tertentu dengan paginasi.",
    sampleUrl: "/api/genres/action",
    defaultParam: { key: "genre", value: "action", placeholder: "slug genre (misal: action, romance)" },
    paramsDescription: "genre: string slug",
  },
  {
    method: "GET",
    path: "/api/seasons",
    category: "Catalog",
    description: "Mengambil daftar musim penayangan anime (Winter, Spring, Summer, Fall) dari tahun ke tahun.",
    sampleUrl: "/api/seasons",
  },
  {
    method: "GET",
    path: "/api/seasons/{season}",
    category: "Catalog",
    description: "Mengambil daftar anime berdasarkan musim rilis tertentu dengan paginasi (?page= atau ?cursor=).",
    sampleUrl: "/api/seasons/winter-2024",
    defaultParam: { key: "season", value: "winter-2024", placeholder: "slug musim (misal: winter-2024)" },
    paramsDescription: "season: string slug · cursor: dari next_cursor response",
  },
  {
    method: "GET",
    path: "/api/trending",
    category: "Catalog",
    description:
      "Judul paling banyak dilihat beberapa hari terakhir (view tracker sendBeacon, menghormati DNT). Kosong = belum ada data.",
    sampleUrl: "/api/trending",
  },
  {
    method: "GET",
    path: "/api/anime/{slug}",
    category: "Detail",
    description:
      "Mengambil metadata detail lengkap anime (judul, poster, sinopsis, produser, skor, trailer, download).",
    sampleUrl: "/api/anime/naruto-batch-sub-indo",
    defaultParam: { key: "slug", value: "naruto-batch-sub-indo", placeholder: "slug anime..." },
    paramsDescription: "slug: string identifier",
  },
  {
    method: "GET",
    path: "/api/anime/{slug}/download",
    category: "Detail",
    description: "Mengambil daftar tautan download per resolusi (360p, 480p, 720p, 1080p) dan platform cloud mirror.",
    sampleUrl: "/api/anime/naruto-batch-sub-indo/download",
    defaultParam: { key: "slug", value: "naruto-batch-sub-indo", placeholder: "slug anime..." },
    paramsDescription: "slug: string identifier",
  },
  {
    method: "GET",
    path: "/api/anime/{slug}/episodes",
    category: "Detail",
    description:
      "Daftar episode terstruktur: mirror per resolusi/platform sudah dipisah dari judul batch, plus flag is_torrent.",
    sampleUrl: "/api/anime/naruto-batch-sub-indo/episodes",
    defaultParam: { key: "slug", value: "naruto-batch-sub-indo", placeholder: "slug anime..." },
    paramsDescription: "slug: string identifier",
  },
  {
    method: "GET",
    path: "/api/anime/bulk",
    category: "Detail",
    description:
      "Mengambil banyak metadata anime sekaligus (GET: ?slugs=a,b atau POST body {slugs,fields}). Mendukung fields= dan ETag/304.",
    sampleUrl: "/api/anime/bulk?slugs=naruto-batch-sub-indo,bleach-batch-sub-indo",
    defaultParam: { key: "slugs", value: "naruto-batch-sub-indo,bleach-batch-sub-indo", placeholder: "slug1,slug2..." },
    paramsDescription: "slugs: comma separated (maks 20) · fields: title,score,download,…",
  },
  {
    method: "GET",
    path: "/feed.xml",
    category: "Feed & Spec",
    description: "RSS / Atom XML Feed resmi Kokunime yang mendukung filter parameter genre dan season.",
    sampleUrl: "/feed.xml",
  },
  {
    method: "GET",
    path: "/feed.json",
    category: "Feed & Spec",
    description: "JSON Feed v1.1 resmi untuk integrasi pembaca feed modern.",
    sampleUrl: "/feed.json",
  },
];

const ApiDocsPage = (): JSX.Element => (
  <MainLayout>
    <script
      id="api-breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJsonLd(buildSubpageBreadcrumbJsonLd([{ name: "REST API Docs", url: "/api" }])),
      }}
      suppressHydrationWarning
    />

    <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20 space-y-10">
      {/* Header Banner */}
      <div className="card-shell overflow-hidden">
        <div className="card-core p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                Developer Hub
              </span>
              <span className="rounded-sm border border-border bg-surface-muted px-2.5 py-0.5 font-mono text-xs font-bold text-ink-muted">
                Public API v1.0
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-ink">
              Kokunime Public REST API
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted max-w-2xl">
              Gunakan REST API publik Kokunime secara gratis untuk integrasi aplikasi mobile, bot Discord/Telegram, atau
              workflow automasi Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="/api/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-accent px-4 py-2 font-mono text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
            >
              <span>📜 OpenAPI 3.1 Spec ↗</span>
            </a>
            <Link
              href="/api/graphql"
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-surface px-4 py-2 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:text-ink transition-all active:translate-y-0 active:shadow-none"
            >
              <span>⚡ GraphQL Playground</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Zero Auth Required", desc: "Akses instan tanpa perlu API key atau registrasi akun.", icon: "🔓" },
          {
            title: "CORS Enabled",
            desc: "Mendukung Access-Control-Allow-Origin: * untuk frontend web klien.",
            icon: "🌐",
          },
          {
            title: "In-Memory & Edge Cache",
            desc: "Header Stale-While-Revalidate untuk latensi sub-15ms.",
            icon: "⚡",
          },
          { title: "Multi-Format Output", desc: "Tersedia format JSON, RSS XML, JSON Feed, dan OpenAPI.", icon: "📡" },
        ].map((f, i) => (
          <div
            key={i}
            className="p-4 rounded-sm border-2 border-border bg-surface-solid space-y-1 shadow-[2px_2px_0_0_var(--border)]"
          >
            <span className="text-xl">{f.icon}</span>
            <h3 className="font-display text-xs font-bold text-ink">{f.title}</h3>
            <p className="text-[11px] text-ink-muted leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Endpoints Explorer */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b-2 border-border pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm border-2 border-border bg-nb-pink text-sm text-nb-ink">
            📡
          </span>
          <h2 className="font-display text-lg font-bold text-ink">Daftar Endpoint API & Live Tester</h2>
        </div>

        <div className="space-y-4">
          {ENDPOINTS.map((ep) => (
            <ApiTester key={ep.path} endpoint={ep} />
          ))}
        </div>
      </div>

      {/* Deprecation policy */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-border pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm border-2 border-border bg-nb-yellow text-sm text-nb-ink">
            📌
          </span>
          <h2 className="font-display text-lg font-bold text-ink">Kebijakan Deprecation & Versioning</h2>
        </div>
        <div className="rounded-sm border-2 border-border bg-surface-solid p-4 shadow-[2px_2px_0_0_var(--border)]">
          <ul className="space-y-2 text-xs text-ink-muted leading-relaxed">
            <li>
              <strong className="text-ink">Versi:</strong> API memakai semver yang tercermin di{" "}
              <a href="/api/openapi.json" className="underline decoration-dotted hover:text-ink">
                info.version OpenAPI
              </a>{" "}
              (saat ini 1.1.0). Perubahan breaking hanya di rilis major.
            </li>
            <li>
              <strong className="text-ink">Soft deprecation:</strong> endpoint yang akan digantikan tetap melayani
              request minimal satu minor version dan membawa header <code>Deprecation: true</code> plus{" "}
              <code>Sunset: &lt;tanggal RFC 1123&gt;</code> yang menunjuk ke endpoint pengganti.
            </li>
            <li>
              <strong className="text-ink">Removal:</strong> penghapusan hanya setelah periode Sunset lewat, diumumkan
              lewat changelog OpenAPI, dan tidak pernah dalam patch release.
            </li>
            <li>
              <strong className="text-ink">Field baru</strong> bersifat additive — klien lama tetap valid; gunakan{" "}
              <code>fields=</code> bila ingin payload minimal.
            </li>
          </ul>
        </div>
      </div>
    </section>
  </MainLayout>
);

export default ApiDocsPage;
