import MainLayout from "@/layouts/main-layout";
import ApiTester, { ApiEndpoint } from "@/components/api-tester";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Developer REST API & GraphQL · Kokunime Hub",
  description: "Dokumentasi publik REST API & GraphQL Kokunime untuk bot Discord/Telegram, aplikasi mobile, dan automasi.",
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
    path: "/api/random",
    category: "General",
    description: "Mendapatkan dan mengarahkan (307 redirect) secara acak ke salah satu anime di katalog.",
    sampleUrl: "/api/random",
  },
  {
    method: "GET",
    path: "/api/search?q={query}",
    category: "Catalog",
    description: "Pencarian anime secara real-time langsung ke upstream scraper tanpa delay cache.",
    sampleUrl: "/api/search?q=naruto",
    defaultParam: { key: "q", value: "naruto", placeholder: "kata kunci pencarian..." },
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
    description: "Mengambil daftar anime berdasarkan musim rilis tertentu dengan paginasi.",
    sampleUrl: "/api/seasons/winter-2024",
    defaultParam: { key: "season", value: "winter-2024", placeholder: "slug musim (misal: winter-2024)" },
    paramsDescription: "season: string slug",
  },
  {
    method: "GET",
    path: "/api/anime/{slug}",
    category: "Detail",
    description: "Mengambil metadata detail lengkap anime (judul, poster, sinopsis, produser, skor, trailer, download).",
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
    path: "/api/anime/bulk",
    category: "Detail",
    description: "Mengambil banyak metadata anime sekaligus dalam satu panggilan API (bulk batch query).",
    sampleUrl: "/api/anime/bulk?slugs=naruto-batch-sub-indo,bleach-batch-sub-indo",
    defaultParam: { key: "slugs", value: "naruto-batch-sub-indo,bleach-batch-sub-indo", placeholder: "slug1,slug2..." },
    paramsDescription: "slugs: comma separated",
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
              <span className="rounded-full bg-surface-muted px-2.5 py-0.5 font-mono text-xs font-bold text-ink-muted">
                Public API v1.0
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-ink">
              Kokunime Public REST API
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted max-w-2xl">
              Gunakan REST API publik Kokunime secara gratis untuk integrasi aplikasi mobile, bot Discord/Telegram, atau workflow automasi Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="/api/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-mono text-xs font-bold text-(--accent-ink) shadow-md transition-transform hover:scale-[1.02] active:scale-95"
            >
              <span>📜 OpenAPI 3.1 Spec ↗</span>
            </a>
            <Link
              href="/api/graphql"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 font-mono text-xs font-bold text-ink hover:border-accent hover:text-accent transition-colors"
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
          { title: "CORS Enabled", desc: "Mendukung Access-Control-Allow-Origin: * untuk frontend web klien.", icon: "🌐" },
          { title: "In-Memory & Edge Cache", desc: "Header Stale-While-Revalidate untuk latensi sub-15ms.", icon: "⚡" },
          { title: "Multi-Format Output", desc: "Tersedia format JSON, RSS XML, JSON Feed, dan OpenAPI.", icon: "📡" },
        ].map((f, i) => (
          <div key={i} className="p-4 rounded-2xl border border-border bg-surface-solid space-y-1">
            <span className="text-xl">{f.icon}</span>
            <h3 className="font-display text-xs font-bold text-ink">{f.title}</h3>
            <p className="text-[11px] text-ink-muted leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Endpoints Explorer */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-sm">📡</span>
          <h2 className="font-display text-lg font-bold text-ink">Daftar Endpoint API & Live Tester</h2>
        </div>

        <div className="space-y-4">
          {ENDPOINTS.map((ep) => (
            <ApiTester key={ep.path} endpoint={ep} />
          ))}
        </div>
      </div>
    </section>
  </MainLayout>
);

export default ApiDocsPage;
