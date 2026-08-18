import { getAnimeByGenres } from "@/services/scraper";
import { SITE_URL } from "@/lib/site";
import { toTitle } from "@/utils/to-title";
import AnimeListing from "@/sections/anime-listing";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JSX } from "react";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { genre } = await params;
  const page = Number((await searchParams)?.page) || 1;
  const title = toTitle(genre);

  return {
    title: `Genre ${title}`,
    description: `Daftar anime dengan genre ${title}.`,
    alternates: { canonical: page > 1 ? `/genres/${genre}?page=${page}` : `/genres/${genre}` },
    openGraph: {
      title: `Genre ${title}`,
      url: `${SITE_URL}${page > 1 ? `/genres/${genre}?page=${page}` : `/genres/${genre}`}`,
    },
  };
}

const GenrePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<JSX.Element> => {
  const { genre } = await params;
  const page = Number((await searchParams)?.page) || 1;

  const { anime = [], pagination } = await getAnimeByGenres(genre, page);

  if (anime.length === 0 && !pagination) {
    notFound();
  }

  return (
    <MainLayout>
      <AnimeListing chip="Genre" title={toTitle(genre)} anime={anime} pagination={pagination} eagerCount={5} />
    </MainLayout>
  );
};

export default GenrePage;
