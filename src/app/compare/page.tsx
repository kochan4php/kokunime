import CompareAnimeClient from "@/components/compare-anime-client";
import SectionHeader from "@/components/section-header";
import MainLayout from "@/layouts/main-layout";
import { getAnimeDetail } from "@/services/scraper";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { Metadata } from "next";
import { JSX } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Komparasi Anime Side-by-Side · Kokunime",
  description:
    "Bandingkan skor rating, studio produksi, total episode, durasi, dan genre antara dua hingga tiga anime berdampingan secara instan.",
  alternates: {
    canonical: `${SITE_URL}/compare`,
  },
  openGraph: {
    title: "Komparasi Anime Side-by-Side · Kokunime",
    description:
      "Bandingkan skor rating, studio produksi, total episode, durasi, dan genre antara dua hingga tiga anime berdampingan.",
    url: `${SITE_URL}/compare`,
  },
};

interface ComparePageProps {
  searchParams: Promise<{ a?: string; b?: string; c?: string }>;
}

const ComparePage = async ({ searchParams }: ComparePageProps): Promise<JSX.Element> => {
  const { a: rawA = "", b: rawB = "", c: rawC = "" } = await searchParams;
  const slugA = decodeURIComponent(rawA).trim();
  const slugB = decodeURIComponent(rawB).trim();
  const slugC = decodeURIComponent(rawC).trim();

  const [animeA, animeB, animeC] = await Promise.all([
    slugA ? getAnimeDetail(slugA).catch(() => null) : Promise.resolve(null),
    slugB ? getAnimeDetail(slugB).catch(() => null) : Promise.resolve(null),
    slugC ? getAnimeDetail(slugC).catch(() => null) : Promise.resolve(null),
  ]);

  return (
    <MainLayout>
      <script
        id="compare-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(buildSubpageBreadcrumbJsonLd([{ name: "Komparasi Anime", url: "/compare" }])),
        }}
        suppressHydrationWarning
      />
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
        <SectionHeader
          kicker="Fitur Eksklusif"
          title="Perbandingan Anime Side-by-Side"
          titleAs="h1"
          className="mb-8"
          badge={
            <span className="rounded-sm border border-border bg-surface-muted px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink-muted">
              Side-by-Side
            </span>
          }
          description="Pilih dan bandingkan dua hingga tiga anime secara berdampingan untuk menganalisis perbedaan skor MyAnimeList, studio produksi, total episode, durasi tayang, genre unik, dan sinopsis secara instan."
        />

        <CompareAnimeClient
          initialAnimeA={animeA}
          initialAnimeB={animeB}
          initialAnimeC={animeC}
          initialSlugA={slugA}
          initialSlugB={slugB}
          initialSlugC={slugC}
        />
      </section>
    </MainLayout>
  );
};

export default ComparePage;
