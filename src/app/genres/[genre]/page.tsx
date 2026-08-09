import { loadAnimeByGenres } from "@/lib/loaders";
import { toTitle } from "@/utils/to-title";
import AnimeListing from "@/sections/anime-listing";
import ListingSkeleton from "@/sections/listing-skeleton";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX, Suspense } from "react";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { genre } = await params;
  const title = toTitle(genre);

  return {
    title: `Genre ${title}`,
    description: `Daftar anime dengan genre ${title}.`,
    alternates: { canonical: `/genres/${genre}` },
  };
}

const GenreContent = async ({ genre, page }: { genre: string; page: number }): Promise<JSX.Element> => {
  const { anime = [], pagination } = await loadAnimeByGenres(genre, page);

  return <AnimeListing chip="Genre" title={toTitle(genre)} anime={anime} pagination={pagination} eagerCount={5} />;
};

const GenrePage = async ({ params, searchParams }: any): Promise<JSX.Element> => {
  const { genre } = await params;
  const page = Number((await searchParams)?.page) || 1;

  return (
    <MainLayout>
      <Suspense fallback={<ListingSkeleton />}>
        <GenreContent genre={genre} page={page} />
      </Suspense>
    </MainLayout>
  );
};

export default GenrePage;
