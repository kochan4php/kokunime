import { loadAnimeBySeasons } from "@/lib/loaders";
import { SITE_URL } from "@/lib/site";
import { toTitle } from "@/utils/to-title";
import AnimeListing from "@/sections/anime-listing";
import ListingSkeleton from "@/sections/listing-skeleton";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JSX, Suspense } from "react";

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
    alternates: { canonical: page > 1 ? `/seasons/${season}?page=${page}` : `/seasons/${season}` },
    openGraph: {
      title: `Season ${title}`,
      url: `${SITE_URL}${page > 1 ? `/seasons/${season}?page=${page}` : `/seasons/${season}`}`,
    },
  };
}

const SeasonContent = async ({ season, page }: { season: string; page: number }): Promise<JSX.Element> => {
  const { anime = [], pagination } = await loadAnimeBySeasons(season, page);

  return <AnimeListing chip="Season" title={toTitle(season)} anime={anime} pagination={pagination} eagerCount={5} />;
};

const SeasonPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ season: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<JSX.Element> => {
  const { season } = await params;
  const page = Number((await searchParams)?.page) || 1;

  const { anime = [], pagination } = await loadAnimeBySeasons(season, page);

  if (anime.length === 0 && !pagination) {
    notFound();
  }

  return (
    <MainLayout>
      <Suspense fallback={<ListingSkeleton />}>
        <SeasonContent season={season} page={page} />
      </Suspense>
    </MainLayout>
  );
};

export default SeasonPage;
