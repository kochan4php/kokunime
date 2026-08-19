import AnimeImage from "@/components/cards/anime-image";
import BookmarkButton from "@/components/anime/bookmark-button";
import { ArrowUpRightIcon } from "@/components/icons";
import { AnimeCardProps } from "@/interfaces";
import Link from "next/link";
import { JSX } from "react";

const CardAnime = ({
  src,
  alt,
  title,
  meta,
  genres,
  path,
  eager = false,
  priority = false,
}: AnimeCardProps): JSX.Element => {
  const slug = path.startsWith("/anime/") ? path.replace("/anime/", "") : undefined;
  const isOngoing = /menit|jam|pm|am|today|hari|ongoing/i.test(meta || "");
  const isCompleted = /complete|tamat/i.test(meta || "");

  return (
    <Link href={path} className="group block h-full select-none active:scale-[0.98] transition-transform duration-100">
      <div className="card-shell h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-accent/40 rounded-xl sm:rounded-2xl">
        <div className="card-core flex flex-col h-full overflow-hidden rounded-xl sm:rounded-2xl">
          {/* Poster Image Container */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-muted">
            <AnimeImage
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, (max-width: 1440px) 18vw, 14vw"
              src={src}
              alt={alt || title}
              loading={eager ? "eager" : "lazy"}
              priority={priority}
              fetchPriority={priority ? "high" : undefined}
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
            />
            {/* Top & Bottom Vignette Gradients */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />

            {/* Floating Bookmark Button */}
            {slug && (
              <span className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 z-10 opacity-85 transition-all duration-200 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 group-hover:scale-100 scale-95">
                <BookmarkButton
                  slug={slug}
                  title={title}
                  image={src}
                  release={meta}
                  className="!h-6 !w-6 sm:!h-7 sm:!w-7 bg-black/65 backdrop-blur-md border-white/20 text-white shadow-md hover:border-accent hover:text-accent"
                />
              </span>
            )}

            {/* Release / Status Badge */}
            {meta && (
              <span className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center gap-1 rounded-full bg-black/75 px-1.5 sm:px-2 py-0.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-white border border-white/10 backdrop-blur-md shadow-xs max-w-[calc(100%-0.75rem)]">
                {isOngoing && (
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                )}
                {isCompleted && (
                  <span className="text-[9px] text-accent font-bold">✓</span>
                )}
                <span className="truncate">{meta}</span>
              </span>
            )}

            {/* Quick View Hover Indicator */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2 pt-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-between">
              <span className="font-display text-[10px] sm:text-[11px] font-bold text-accent flex items-center gap-1">
                <span>Lihat</span>
                <span>→</span>
              </span>
              <span className="rounded-md bg-white/20 px-1 py-0.2 font-mono text-[7px] sm:text-[8px] font-bold text-white uppercase backdrop-blur-xs">
                Detail
              </span>
            </div>

            {/* Top Right Arrow Launcher */}
            <span className="pointer-events-none absolute right-1.5 top-1.5 sm:right-2 sm:top-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-100 group-hover:scale-100 scale-75 backdrop-blur-xs">
              <ArrowUpRightIcon />
            </span>
          </div>

          {/* Title and Genre Area */}
          <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between min-w-0 bg-surface-solid/90 gap-1">
            <h3 className="line-clamp-2 font-display text-[11px] sm:text-xs md:text-[13px] font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-accent break-words">
              {title}
            </h3>
            {genres && genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 overflow-hidden">
                {genres.slice(0, 2).map((g) => (
                  <span
                    key={g}
                    className="rounded bg-surface-muted px-1.5 py-0.2 font-mono text-[8px] sm:text-[8.5px] text-ink-muted group-hover:text-ink transition-colors truncate max-w-[80px]"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardAnime;
