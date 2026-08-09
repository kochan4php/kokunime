import { loadAnimeBySeasons } from "@/lib/loaders";
import { toTitle } from "@/utils/to-title";
import AnimeListing from "@/sections/anime-listing";
import ListingSkeleton from "@/sections/listing-skeleton";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX, Suspense } from "react";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { season } = await params;
  const title = toTitle(season);

  return {
    title: `Season ${title}`,
    description: `Daftar anime rilis musim ${title}.`,
    alternates: { canonical: `/seasons/${season}` },
  };
}

const SeasonContent = async ({ season, page }: { season: string; page: number }): Promise<JSX.Element> => {
  const { anime = [], pagination } = await loadAnimeBySeasons(season, page);

  return <AnimeListing chip="Season" title={toTitle(season)} anime={anime} pagination={pagination} eagerCount={5} />;
};

const SeasonPage = async ({ params, searchParams }: any): Promise<JSX.Element> => {
  const { season } = await params;
  const page = Number((await searchParams)?.page) || 1;

  return (
    <MainLayout>
      <Suspense fallback={<ListingSkeleton />}>
        <SeasonContent season={season} page={page} />
      </Suspense>
    </MainLayout>
  );
};

export default SeasonPage;
