import { getAnimeBySeasons } from "@/lib/api-client";
import { toTitle } from "@/utils/to-title";
import AnimeListing from "@/sections/anime-listing";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX } from "react";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { season } = await params;
  const title = toTitle(season);

  return {
    title: `Season ${title}`,
    description: `Daftar anime rilis musim ${title}.`,
    alternates: { canonical: `/seasons/${season}` },
  };
}

const SeasonPage = async ({ params, searchParams }: any): Promise<JSX.Element> => {
  const { season } = await params;
  const page = Number((await searchParams)?.page) || 1;
  const data = await getAnimeBySeasons(season, page);
  const { anime = [], pagination } = data ?? {};

  return (
    <MainLayout>
      <AnimeListing chip="Season" title={toTitle(season)} anime={anime} pagination={pagination} eagerCount={5} />
    </MainLayout>
  );
};

export default SeasonPage;
