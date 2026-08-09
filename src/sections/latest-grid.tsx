import AnimeGrid from "@/components/anime-grid";
import Pagination from "@/sections/pagination";
import Reveal from "@/components/reveal";
import { Anime, PaginationInfo } from "@/interfaces";
import { JSX } from "react";

interface LatestGridProps {
  anime: Anime[];
  pagination: PaginationInfo;
}

const LatestGrid = ({ anime, pagination }: LatestGridProps): JSX.Element => (
  <section id="update-now" className="container scroll-mt-28 px-4 py-16 md:py-24">
    <Reveal>
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Katalog
          </span>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
            Update Terbaru
          </h2>
        </div>
        <p className="hidden font-mono text-xs uppercase tracking-widest text-ink-muted md:block">
          Halaman {pagination?.current_page ?? 1} dari {pagination?.total_page ?? 1}
        </p>
      </div>
    </Reveal>
    <AnimeGrid anime={anime} eagerCount={5} />
    <Pagination pagination={pagination} />
  </section>
);

export default LatestGrid;
