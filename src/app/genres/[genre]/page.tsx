import { loadAnimeByGenres } from "@/lib/loaders";
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

const GenreContent = async ({ genre, page }: { genre: string; page: number }): Promise<JSX.Element> => {
  const { anime = [], pagination } = await loadAnimeByGenres(genre, page);

  return <AnimeListing chip="Genre" title={toTitle(genre)} anime={anime} pagination={pagination} eagerCount={5} />;
};

const GenrePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<JSX.Element> => {
  const { genre } = await params;
  const page = Number((await searchParams)?.page) || 1;

  const { anime = [], pagination } = await loadAnimeByGenres(genre, page);

  if (anime.length === 0 && !pagination) {
    notFound();
  }

  return (
    <MainLayout>
      <Suspense fallback={<ListingSkeleton />}>
        <GenreContent genre={genre} page={page} />
      </Suspense>
    </MainLayout>
  );
};

export default GenrePage;
