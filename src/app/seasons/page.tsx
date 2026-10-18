import { getSeasons } from "@/services/scraper";
import SectionHeader from "@/components/section-header";
import { SITE_URL } from "@/lib/site";
import { groupSeasonsByYear, orderYears } from "@/utils/seasons";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import SeasonsExplorer from "@/components/seasons-explorer";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const canonical = "/seasons";

  return {
    title: "Jadwal & Daftar Musim Anime Lengkap",
    description:
      "Jelajahi anime berdasarkan kalender 4 musim rilis (Winter, Spring, Summer, Fall) dari tahun ke tahun di Kokunime.",
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
      <script
        id="seasons-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(buildSubpageBreadcrumbJsonLd([{ name: "Daftar Musim", url: "/seasons" }])),
        }}
        suppressHydrationWarning
      />
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
        <SectionHeader
          kicker="Kalender & Arsip"
          title="Jadwal & Musim Rilis Anime"
          titleAs="h1"
          tone="orange"
          className="mb-8"
          description="Cari anime berdasarkan musim penayangan dari tahun 2000-an hingga musim terbaru saat ini: Musim Dingin (*Winter*), Musim Semi (*Spring*), Musim Panas (*Summer*), dan Musim Gugur (*Fall*)."
        />

        <SeasonsExplorer groups={groups} years={years} />
      </section>
    </MainLayout>
  );
};

export default SeasonsPage;
