import { getGenres } from "@/services/scraper";
import { SITE_URL } from "@/lib/site";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import GenresExplorer from "@/components/genres-explorer";
import MainLayout from "@/layouts/main-layout";
import Script from "next/script";
import { Metadata } from "next";
import { JSX } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const canonical = "/genres";

  return {
    title: "Daftar Genre Anime Lengkap",
    description: "Jelajahi dan temukan ribuan anime subtitle Indonesia berdasarkan genre dan tema favorit Anda di Kokunime.",
    alternates: { canonical, languages: { "id-ID": canonical } },
    openGraph: {
      title: "Daftar Genre Anime Lengkap · Kokunime",
      description: "Jelajahi anime berdasarkan kategori: Action, Isekai, Romance, Fantasy, Sci-Fi, dan lainnya.",
      url: `${SITE_URL}${canonical}`,
    },
  };
}

const GenresPage = async (): Promise<JSX.Element> => {
  const genres = (await getGenres()) ?? [];

  return (
    <MainLayout>
      <Script
        id="genres-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            buildSubpageBreadcrumbJsonLd([{ name: "Daftar Genre", url: "/genres" }]),
          ),
        }}
      />
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
        <div className="mb-8">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Kategori & Tema
          </span>
          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-4xl">
            Daftar Genre Anime
          </h1>
          <p className="mt-2 text-sm text-ink-muted max-w-2xl">
            Temukan tontonan anime favorit Anda berdasarkan kategori, mulai dari aksi menegangkan, petualangan dunia lain (*Isekai*), romansa manis, hingga komedi.
          </p>
        </div>

        <GenresExplorer genres={genres} />
      </section>
    </MainLayout>
  );
};

export default GenresPage;
