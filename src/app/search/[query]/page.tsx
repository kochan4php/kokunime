import AnimeGrid from "@/components/anime-grid";
import EmptyState from "@/components/anime/empty-state";
import Reveal from "@/components/reveal";
import { loadSearchAnime } from "@/lib/loaders";
import { buildSearchMetadata } from "@/lib/search-metadata";
import { Anime } from "@/interfaces";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX } from "react";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  return buildSearchMetadata(params);
}

const SearchAnime = async (props: any): Promise<JSX.Element> => {
  const { query } = (await props.params) ?? "";
  const anime: Anime[] = await loadSearchAnime(query);

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16">
        <Reveal>
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Hasil pencarian
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
            <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-amber bg-clip-text text-transparent">
              “{query.split("+").join(" ")}”
            </span>
          </h1>
        </Reveal>
        {anime.length > 0 ? (
          <div className="mt-12">
            <AnimeGrid anime={anime} eagerCount={anime.length} />
          </div>
        ) : (
          <Reveal>
            <EmptyState />
          </Reveal>
        )}
      </section>
    </MainLayout>
  );
};

export default SearchAnime;
