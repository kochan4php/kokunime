import CompareAnimeClient from "@/components/compare-anime-client";
import MainLayout from "@/layouts/main-layout";
import { getAnimeDetail } from "@/services/scraper";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { Metadata } from "next";
import { JSX } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Komparasi Anime Side-by-Side · Kokunime",
  description: "Bandingkan skor rating, studio produksi, total episode, durasi, dan genre antara dua anime berdampingan secara instan.",
  alternates: {
    canonical: `${SITE_URL}/compare`,
  },
  openGraph: {
    title: "Komparasi Anime Side-by-Side · Kokunime",
    description: "Bandingkan skor rating, studio produksi, total episode, durasi, dan genre antara dua anime berdampingan.",
    url: `${SITE_URL}/compare`,
  },
};

interface ComparePageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

const ComparePage = async ({ searchParams }: ComparePageProps): Promise<JSX.Element> => {
  const { a: rawA = "", b: rawB = "" } = await searchParams;
  const slugA = decodeURIComponent(rawA).trim();
  const slugB = decodeURIComponent(rawB).trim();

  const [animeA, animeB] = await Promise.all([
    slugA ? getAnimeDetail(slugA).catch(() => null) : Promise.resolve(null),
    slugB ? getAnimeDetail(slugB).catch(() => null) : Promise.resolve(null),
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
        {/* Header Title */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Fitur Eksklusif
            </span>
            <span className="rounded-full bg-surface-muted px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink-muted">
              Side-by-Side
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-ink">
            Perbandingan Anime Side-by-Side
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-3xl">
            Pilih dan bandingkan dua anime secara berdampingan untuk menganalisis perbedaan skor MyAnimeList, studio produksi, total episode, durasi tayang, genre unik, dan sinopsis secara instan.
          </p>
        </div>

        <CompareAnimeClient
          initialAnimeA={animeA}
          initialAnimeB={animeB}
          initialSlugA={slugA}
          initialSlugB={slugB}
        />
      </section>
    </MainLayout>
  );
};

export default ComparePage;
