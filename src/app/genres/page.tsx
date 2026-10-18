import { getGenres } from "@/services/scraper";
import { SITE_URL } from "@/lib/site";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import GenresExplorer from "@/components/genres-explorer";
import SectionHeader from "@/components/section-header";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const canonical = "/genres";

  return {
    title: "Daftar Genre Anime Lengkap",
    description:
      "Jelajahi dan temukan ribuan anime subtitle Indonesia berdasarkan genre dan tema favorit Anda di Kokunime.",
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
      <script
        id="genres-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(buildSubpageBreadcrumbJsonLd([{ name: "Daftar Genre", url: "/genres" }])),
        }}
        suppressHydrationWarning
      />
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
        <SectionHeader
          kicker="Kategori & Tema"
          title="Daftar Genre Anime"
          titleAs="h1"
          tone="teal"
          className="mb-8"
          description="Temukan tontonan anime favorit Anda berdasarkan kategori, mulai dari aksi menegangkan, petualangan dunia lain (*Isekai*), romansa manis, hingga komedi."
        />

        <GenresExplorer genres={genres} />
      </section>
    </MainLayout>
  );
};

export default GenresPage;
