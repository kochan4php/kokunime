import MainLayout from "@/layouts/main-layout";
import ApiTester, { ApiEndpoint } from "@/components/api-tester";
import { Metadata } from "next";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Developer REST API · Kokunime",
  description: "Dokumentasi publik REST API Kokunime untuk scraping, bot, dan automasi.",
  alternates: {
    canonical: "https://kokunime.netlify.app/api",
  },
};

const ENDPOINTS: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/health",
    description: "Cek uptime server, latensi koneksi upstream (ms), dan status operasional scraper.",
    sampleUrl: "/api/health",
  },
  {
    method: "GET",
    path: "/api/random",
    description: "Mendapatkan dan mengarahkan (307 redirect) secara acak ke salah satu anime di katalog.",
    sampleUrl: "/api/random",
  },
  {
    method: "GET",
    path: "/api/search?q={query}",
    description: "Pencarian anime secara real-time langsung ke upstream scraper tanpa delay cache.",
    sampleUrl: "/api/search?q=naruto",
    params: "q (string, required): kata kunci judul anime (min 2 karakter)",
  },
  {
    method: "GET",
    path: "/api/genres",
    description: "Mengambil daftar lengkap seluruh kategori genre anime yang tersedia di Kokunime.",
    sampleUrl: "/api/genres",
  },
  {
    method: "GET",
    path: "/api/genres/{genre}",
    description: "Mengambil daftar anime berdasarkan kategori genre tertentu dengan paginasi.",
    sampleUrl: "/api/genres/action",
    params: "genre (string, required): slug genre, page (number, optional): nomor halaman (default: 1)",
  },
  {
    method: "GET",
    path: "/api/seasons",
    description: "Mengambil daftar musim rilis anime (Summer, Fall, Winter, Spring).",
    sampleUrl: "/api/seasons",
  },
  {
    method: "GET",
    path: "/api/seasons/{season}",
    description: "Mengambil daftar anime berdasarkan musim rilis tertentu dengan paginasi.",
    sampleUrl: "/api/seasons/winter-2024",
    params: "season (string, required): slug musim rilis, page (number, optional): nomor halaman (default: 1)",
  },
  {
    method: "GET",
    path: "/api/anime/{slug}",
    description: "Mengambil data detail lengkap anime (judul, sinopsis, produser, skor, trailer, download).",
    sampleUrl: "/api/anime/naruto-batch-sub-indo",
    params: "slug (string, required): endpoint identifier slug anime",
  },
  {
    method: "GET",
    path: "/api/anime/{slug}/download",
    description: "Mengambil daftar link download per resolusi dan platform cloud mirror.",
    sampleUrl: "/api/anime/naruto-batch-sub-indo/download",
    params: "slug (string, required), res (string, optional: filter kualitas seperti '720p')",
  },
  {
    method: "GET",
    path: "/feed.xml",
    description: "RSS / Atom Feed XML resmi yang mendukung parameter filter genre dan season.",
    sampleUrl: "/feed.xml",
    params: "genre (string, optional), season (string, optional)",
  },
];

const ApiDocsPage = (): JSX.Element => (
  <MainLayout>
    <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Developer Hub
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
            Kokunime Public REST API
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted leading-relaxed">
            Gunakan API publik Kokunime secara gratis untuk mengintegrasikan data anime ke aplikasi mobile, bot
            Discord/Telegram, atau workflow automasi Anda.
          </p>
        </div>
        <a
          href="/api/openapi.json"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 font-mono text-xs font-semibold text-ink-muted transition-all hover:border-accent hover:text-accent hover:bg-surface-muted"
        >
          <span>📜 OpenAPI 3.0 Spec</span>
          <span className="text-[10px]">↗</span>
        </a>
      </div>

      <div className="space-y-4">
        {ENDPOINTS.map((ep) => (
          <ApiTester key={ep.path} endpoint={ep} />
        ))}
      </div>
    </section>
  </MainLayout>
);

export default ApiDocsPage;
