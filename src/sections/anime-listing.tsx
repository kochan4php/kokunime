import AnimeGrid from "@/components/anime-grid";
import Pagination from "@/sections/pagination";
import PaginationBar from "@/sections/pagination/bar";
import Reveal from "@/components/reveal";
import { Anime, PaginationInfo } from "@/interfaces";
import { JSX } from "react";

interface AnimeListingProps {
  chip: string;
  title: string;
  anime: Anime[];
  pagination?: PaginationInfo | null;
  eagerCount?: number;
}

const AnimeListing = ({ chip, title, anime, pagination, eagerCount = 0 }: AnimeListingProps): JSX.Element => {
  const hasNumbers = (pagination?.total_page ?? 0) > 0;

  return (
    <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16">
      <Reveal>
        <div className="mb-8">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {chip}
          </span>
          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-4xl">{title}</h1>
        </div>
      </Reveal>
      <AnimeGrid anime={anime} eagerCount={eagerCount} />
      {pagination && (hasNumbers ? <Pagination pagination={pagination} /> : <PaginationBar pagination={pagination} />)}
    </section>
  );
};

export default AnimeListing;
