import { getAnimeByGenres } from "@/lib/api-client";
import { toTitle } from "@/utils/to-title";
import AnimeListing from "@/sections/anime-listing";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX } from "react";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { genre } = await params;
  const title = toTitle(genre);

  return {
    title: `Genre ${title}`,
    description: `Daftar anime dengan genre ${title}.`,
    alternates: { canonical: `/genres/${genre}` },
  };
}

const GenrePage = async ({ params, searchParams }: any): Promise<JSX.Element> => {
  const { genre } = await params;
  const page = Number((await searchParams)?.page) || 1;
  const data = await getAnimeByGenres(genre, page);
  const { anime = [], pagination } = data ?? {};

  return (
    <MainLayout>
      <AnimeListing chip="Genre" title={toTitle(genre)} anime={anime} pagination={pagination} eagerCount={5} />
    </MainLayout>
  );
};

export default GenrePage;
