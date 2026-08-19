import CardAnime from "@/components/cards/card-anime";
import AnimeImage from "@/components/cards/anime-image";
import BookmarkButton from "@/components/anime/bookmark-button";
import { Anime } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import Link from "next/link";
import { JSX } from "react";

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

          const isOngoing = /menit|jam|pm|am|today|hari|ongoing/i.test(item.release || "");
          const isCompleted = /complete|tamat/i.test(item.release || "");

          return (
            <div
              key={endpoint || index}
              className="group relative flex items-center justify-between gap-2.5 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-border bg-surface-solid/90 p-2 sm:p-2.5 transition-all duration-200 hover:border-accent/60 hover:bg-surface hover:shadow-sm active:scale-[0.995]"
            >
              <Link href={`/anime/${endpoint}`} className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                <div className="relative h-13 w-10 sm:h-16 sm:w-12 shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-surface-muted border border-border/80 shadow-xs">
                  {item?.link?.image && (
                    <AnimeImage
                      fill
                      sizes="48px"
                      src={item.link.image}
                      alt={item.title ?? ""}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {isOngoing && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 font-mono text-[8px] sm:text-[9px] font-bold text-emerald-500 shrink-0">
                        <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Ongoing</span>
                      </span>
                    )}
                    {isCompleted && (
                      <span className="rounded-full bg-accent/10 border border-accent/30 px-1.5 py-0.2 font-mono text-[8px] sm:text-[9px] font-bold text-accent shrink-0">
                        Completed
                      </span>
                    )}
                  </div>
                  <h3 className="mt-0.5 line-clamp-1 font-display text-xs sm:text-[13px] font-bold text-ink transition-colors group-hover:text-accent">
                    {item.title}
                  </h3>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-ink-muted">
                    {item.release && <span className="text-ink-muted">{item.release}</span>}
                    {item.genres && item.genres.length > 0 && (
                      <span className="hidden sm:inline-block text-ink-muted/80">• {item.genres.slice(0, 3).join(", ")}</span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-1.5 shrink-0">
                <BookmarkButton
                  slug={endpoint}
                  title={item.title}
                  image={item.link?.image}
                  release={item.release}
                  className="!h-7 !w-7 bg-surface border-border text-ink-muted hover:border-accent hover:text-accent"
                />
                <Link
                  href={`/anime/${endpoint}`}
                  className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-accent/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-accent group-hover:bg-accent group-hover:text-(--accent-ink) transition-colors"
                >
                  <span>Detail</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-5 md:gap-3 lg:grid-cols-5 lg:gap-3.5 xl:grid-cols-6 2xl:grid-cols-6">
      {anime.map((item: Anime, index: number) => {
        const endpoint = animeSlug(item?.link?.endpoint);
        if (!endpoint) return null;

        const eager = index < eagerCount;
        return (
          <CardAnime
            key={endpoint || index}
            path={`/anime/${endpoint}`}
            src={item?.link?.image as string}
            title={item?.title}
            meta={item?.release}
            genres={item?.genres}
            eager={eager}
            priority={index < 2}
          />
        );
      })}
    </div>
  );
};

export default AnimeGrid;
