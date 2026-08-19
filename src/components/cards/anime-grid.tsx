import CardAnime from "@/components/cards/card-anime";
import AnimeImage from "@/components/cards/anime-image";
import Reveal from "@/components/reveal";
import { Anime } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import Link from "next/link";
import { Fragment, JSX } from "react";

interface AnimeGridProps {
  anime: Anime[];
  eagerCount?: number;
  viewMode?: "grid" | "list";
}

const AnimeGrid = ({ anime, eagerCount = 0, viewMode = "grid" }: AnimeGridProps): JSX.Element => {
  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-2">
        {anime.map((item: Anime, index: number) => {
          const endpoint = animeSlug(item?.link?.endpoint);
          if (!endpoint) return null;

          return (
            <Link
              key={index}
              href={`/anime/${endpoint}`}
              className="flex items-center gap-3.5 rounded-2xl border border-border bg-surface-solid p-2.5 transition-all duration-200 hover:border-accent hover:bg-surface-muted hover:shadow-md active:scale-[0.99] group"
            >
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-muted border border-border">
                {item?.link?.image && (
                  <AnimeImage
                    fill
                    sizes="48px"
                    src={item.link.image}
                    alt={item.title ?? ""}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="line-clamp-1 font-display text-sm font-bold text-ink transition-colors group-hover:text-accent">
                  {item.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-muted">
                  {item.release && <span>{item.release}</span>}
                  {item.genres && item.genres.length > 0 && (
                    <span className="hidden sm:inline-block">• {item.genres.slice(0, 3).join(", ")}</span>
                  )}
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-semibold text-accent group-hover:bg-accent group-hover:text-(--accent-ink) transition-colors">
                <span>Detail</span>
                <span>→</span>
              </span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 min-[540px]:grid-cols-3 min-[540px]:gap-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
      {anime.map((item: Anime, index: number) => {
        const endpoint = animeSlug(item?.link?.endpoint);
        if (!endpoint) return null;

        const eager = index < eagerCount;
        const card = (
          <CardAnime
            path={`/anime/${endpoint}`}
            src={item?.link?.image as string}
            title={item?.title}
            meta={item?.release}
            eager={eager}
            // First card is the LCP candidate on listing pages (genre/season/
            // search have no hero image) — fetchpriority=high beats the
            // default-priority request queue.
            priority={index === 0}
          />
        );

        // Eager cards are the above-fold ones — on genre/season/search pages the
        // first card IS the LCP element, and Reveal's SSR opacity-0 delayed it
        // ~1s. Below-fold cards keep the scroll-reveal animation.
        return eager ? (
          <Fragment key={index}>{card}</Fragment>
        ) : (
          <Reveal key={index} className="h-full" delay={(index % 5) * 80}>
            {card}
          </Reveal>
        );
      })}
    </div>
  );
};

export default AnimeGrid;
