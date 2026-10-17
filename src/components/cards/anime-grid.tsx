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
      <div className="nb-cycle flex flex-col gap-2.5">
        {anime.map((item: Anime, index: number) => {
          const endpoint = animeSlug(item?.link?.endpoint);
          if (!endpoint) return null;

          const isOngoing = /menit|jam|pm|am|today|hari|ongoing/i.test(item.release || "");
          const isCompleted = /complete|tamat/i.test(item.release || "");

          return (
            <div
              key={endpoint || index}
              className="group relative flex items-center justify-between gap-2.5 sm:gap-3.5 rounded-sm border-2 border-l-[6px] border-border border-l-(--nb-card) bg-surface-solid p-2 sm:p-2.5 shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--border)] active:translate-y-0 active:shadow-none"
            >
              <Link href={`/anime/${endpoint}`} className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                <div className="relative h-13 w-10 sm:h-16 sm:w-12 shrink-0 overflow-hidden rounded-sm border-2 border-border bg-surface-muted">
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
                      <span className="flex items-center gap-1 rounded-sm border-2 border-border bg-nb-lime px-1.5 py-0.2 font-mono text-[8px] sm:text-[9px] font-bold text-nb-ink shrink-0">
                        <span className="h-1 w-1 rounded-full bg-nb-ink animate-pulse" />
                        <span>Ongoing</span>
                      </span>
                    )}
                    {isCompleted && (
                      <span className="rounded-sm border-2 border-border bg-nb-teal px-1.5 py-0.2 font-mono text-[8px] sm:text-[9px] font-bold text-nb-ink shrink-0">
                        Completed
                      </span>
                    )}
                  </div>
                  <h3 className="mt-0.5 line-clamp-1 font-display text-xs sm:text-[13px] font-bold text-ink group-hover:underline decoration-2 underline-offset-2">
                    {item.title}
                  </h3>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-ink-muted">
                    {item.release && <span className="text-ink-muted">{item.release}</span>}
                    {item.genres && item.genres.length > 0 && (
                      <span className="hidden sm:inline-block text-ink-muted/80">
                        • {item.genres.slice(0, 3).join(", ")}
                      </span>
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
                  className="!h-8 !w-8 rounded-sm border-2 border-border bg-surface text-ink shadow-[2px_2px_0_0_var(--border)] hover:bg-nb-yellow hover:text-nb-ink"
                />
                <Link
                  href={`/anime/${endpoint}`}
                  className="hidden sm:inline-flex items-center gap-1 rounded-sm border-2 border-border bg-accent px-2.5 py-1 font-mono text-[11px] font-semibold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
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
    <div className="nb-cycle grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-5 md:gap-3 lg:grid-cols-5 lg:gap-3.5 xl:grid-cols-6 2xl:grid-cols-6">
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
