import AnimeGrid from "@/components/anime-grid";
import EmptyState from "@/components/anime/empty-state";
import Reveal from "@/components/reveal";
import { loadSearchAnime } from "@/lib/loaders";
import { buildSearchMetadata, decodeQuery } from "@/lib/search-metadata";
import { Anime } from "@/interfaces";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX } from "react";

export async function generateMetadata({ params }: { params: Promise<{ query: string }> }): Promise<Metadata> {
  return buildSearchMetadata(params);
}

const SearchAnime = async ({ params }: { params: Promise<{ query: string }> }): Promise<JSX.Element> => {
  const { query: rawQuery } = await params;
  const query = decodeQuery(rawQuery);
  const anime: Anime[] = await loadSearchAnime(query);

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16">
        {/* No Reveal on the h1 — it is the LCP element here (no hero image). */}
        <span className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Hasil pencarian
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
          <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-amber bg-clip-text text-transparent">
            “{query.split("+").join(" ")}”
          </span>
        </h1>
        {anime.length > 0 ? (
          <div className="mt-12">
            <AnimeGrid anime={anime} eagerCount={Math.min(anime.length, 6)} />
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
