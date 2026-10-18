import SearchResults from "@/sections/search-results";
import SearchHistoryChips from "@/components/search-history-chips";
import SectionHeader from "@/components/section-header";
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
        <SectionHeader
          kicker="Hasil pencarian"
          title={`“${query.split("+").join(" ")}”`}
          titleAs="h1"
          tone="teal"
          className="mb-6"
          badge={
            <span className="rounded-sm border-2 border-border bg-nb-lime px-2.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
              {anime.length} Judul
            </span>
          }
          description="Hasil dari katalog Kokunime. Pilih judul untuk melihat sinopsis, detail episode, dan link unduhan."
        />
        <SearchHistoryChips query={decoded} />
        <SearchResults anime={anime} />
      </section>
    </MainLayout>
  );
};

export default SearchAnime;
