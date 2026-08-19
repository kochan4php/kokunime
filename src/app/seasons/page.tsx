import { getSeasons } from "@/services/scraper";
import { SITE_URL } from "@/lib/site";
import { groupSeasonsByYear, orderYears } from "@/utils/seasons";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import SeasonsExplorer from "@/components/seasons-explorer";
import MainLayout from "@/layouts/main-layout";
import Script from "next/script";
import { Metadata } from "next";
import { JSX } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const canonical = "/seasons";

  return {
    title: "Jadwal & Daftar Musim Anime Lengkap",
    description: "Jelajahi anime berdasarkan kalender 4 musim rilis (Winter, Spring, Summer, Fall) dari tahun ke tahun di Kokunime.",
    alternates: { canonical, languages: { "id-ID": canonical } },
    openGraph: {
      title: "Jadwal & Daftar Musim Anime Lengkap · Kokunime",
      description: "Jelajahi anime berdasarkan musim rilis dari tahun ke tahun.",
      url: `${SITE_URL}${canonical}`,
    },
  };
}

const SeasonsPage = async (): Promise<JSX.Element> => {
  const seasons = await getSeasons();
  const groups = groupSeasonsByYear(seasons);
  const years = orderYears(groups);

  return (
    <MainLayout>
      <Script
        id="seasons-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            buildSubpageBreadcrumbJsonLd([{ name: "Daftar Musim", url: "/seasons" }]),
          ),
        }}
      />
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
        <div className="mb-8">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Kalender & Arsip
          </span>
          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-4xl">
            Jadwal & Musim Rilis Anime
          </h1>
          <p className="mt-2 text-sm text-ink-muted max-w-2xl">
            Cari anime berdasarkan musim penayangan dari tahun 2000-an hingga musim terbaru saat ini: Musim Dingin (*Winter*), Musim Semi (*Spring*), Musim Panas (*Summer*), dan Musim Gugur (*Fall*).
          </p>
        </div>

        <SeasonsExplorer groups={groups} years={years} />
      </section>
    </MainLayout>
  );
};

export default SeasonsPage;
