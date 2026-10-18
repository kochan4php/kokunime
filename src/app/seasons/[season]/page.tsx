import { getAnimeBySeasons } from "@/services/scraper";
import { SITE_URL } from "@/lib/site";
import { toTitle } from "@/utils/to-title";
import { getSeasonWindow } from "@/utils/season-window";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import AnimeListing from "@/sections/anime-listing";
import Breadcrumbs from "@/components/breadcrumbs";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JSX } from "react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ season: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { season } = await params;
  const page = Number((await searchParams)?.page) || 1;
  const title = toTitle(season);

  return {
    title: `Season ${title}`,
    description: `Daftar anime rilis musim ${title}.`,
    alternates: {
      canonical: page > 1 ? `/seasons/${season}?page=${page}` : `/seasons/${season}`,
      types: { "application/rss+xml": `/seasons/${season}/feed.xml` },
    },
    openGraph: {
      title: `Season ${title}`,
      url: `${SITE_URL}${page > 1 ? `/seasons/${season}?page=${page}` : `/seasons/${season}`}`,
    },
  };
}

const SeasonPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ season: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<JSX.Element> => {
  const { season } = await params;
  const page = Number((await searchParams)?.page) || 1;

  const { anime = [], pagination } = await getAnimeBySeasons(season, page);

  if (anime.length === 0 && !pagination) {
    notFound();
  }

  const title = toTitle(season);
  const seasonWindow = getSeasonWindow(season);

  return (
    <MainLayout>
      <script
        id="season-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            buildSubpageBreadcrumbJsonLd([
              { name: "Musim", url: "/seasons" },
              { name: title, url: `/seasons/${season}` },
            ]),
          ),
        }}
        suppressHydrationWarning
      />
      <Breadcrumbs items={[{ name: "Musim", href: "/seasons" }, { name: title }]} />
      {seasonWindow && seasonWindow.state !== "ended" ? (
        <section className="container px-4 pt-4">
          <p className="inline-flex items-center gap-2 rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink shadow-[2px_2px_0_0_var(--border)]">
            {seasonWindow.state === "airing"
              ? `🟢 Sedang tayang · sisa ${seasonWindow.daysUntilEnd} hari`
              : `⏳ Mulai dalam ${seasonWindow.daysUntilStart} hari`}
          </p>
        </section>
      ) : null}
      <AnimeListing chip="Season" title={title} anime={anime} pagination={pagination} eagerCount={5} />
    </MainLayout>
  );
};

export default SeasonPage;
