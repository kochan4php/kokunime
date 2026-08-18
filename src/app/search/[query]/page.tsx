import SearchResults from "@/sections/search-results";
import { searchAnime } from "@/services/scraper";
import { sanitizeQuery } from "@/services/scraper/sanitize";
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
  const decoded = decodeQuery(rawQuery);
  const query = sanitizeQuery(decoded, 80);
  const anime: Anime[] = query ? await searchAnime(query) : [];

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16">
        <span className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Hasil pencarian
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
          <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-amber bg-clip-text text-transparent">
            “{query.split("+").join(" ")}”
          </span>
        </h1>
        <SearchResults anime={anime} />
      </section>
    </MainLayout>
  );
};

export default SearchAnime;
