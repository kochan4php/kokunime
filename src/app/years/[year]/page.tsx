import { getAnimeBySeasons, getSeasons } from "@/services/scraper";
import { SITE_URL } from "@/lib/site";
import { endpointSlug } from "@/utils/endpoint-slug";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import AnimeListing from "@/sections/anime-listing";
import MainLayout from "@/layouts/main-layout";
import { Anime } from "@/interfaces";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JSX } from "react";

export const dynamic = "force-dynamic";

const YEAR_RE = /^(19|20)\d{2}$/;

async function collectYearAnime(year: string): Promise<Anime[]> {
  const seasons = (await getSeasons())
    .map((season) => endpointSlug(season.endpoint, "seasons"))
    .filter((slug): slug is string => Boolean(slug?.endsWith(`-${year}`)));

  const results = await Promise.allSettled(seasons.map((slug) => getAnimeBySeasons(slug, 1)));
  const seen = new Set<string>();
  const anime: Anime[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value.anime ?? []) {
      const key = item.link?.endpoint ?? item.title;
      if (seen.has(key)) continue;
      seen.add(key);
      anime.push(item);
    }
  }

  return anime;
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  if (!YEAR_RE.test(year)) return { title: "Tahun tidak ditemukan" };

  const canonical = `/years/${year}`;
  return {
    title: `Anime Tahun ${year}`,
    description: `Daftar anime rilis tahun ${year} lengkap dengan link download batch subtitle Indonesia.`,
    alternates: { canonical, languages: { "id-ID": canonical } },
    openGraph: {
      title: `Anime Tahun ${year} · Kokunime`,
      description: `Semua anime rilis ${year} dalam satu halaman.`,
      url: `${SITE_URL}${canonical}`,
    },
  };
}

const YearPage = async ({ params }: { params: Promise<{ year: string }> }): Promise<JSX.Element> => {
  const { year } = await params;
  if (!YEAR_RE.test(year)) notFound();

  const anime = await collectYearAnime(year);
  if (anime.length === 0) notFound();

  return (
    <MainLayout>
      <script
        id="year-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            buildSubpageBreadcrumbJsonLd([
              { name: "Musim", url: "/seasons" },
              { name: `Anime ${year}`, url: `/years/${year}` },
            ]),
          ),
        }}
        suppressHydrationWarning
      />
      <AnimeListing chip="Tahun" title={`Anime ${year}`} anime={anime} eagerCount={5} />
    </MainLayout>
  );
};

export default YearPage;
