import AnimeImage from "@/components/cards/anime-image";
import BookmarkButton from "@/components/anime/bookmark-button";
import ViewTransitionLink from "@/components/view-transition-link";
import { AnimeCardProps } from "@/interfaces";
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
    <ViewTransitionLink href={path} className="cv-auto group block h-full select-none">
      <div className="card-shell h-full">
        <div className="card-core flex flex-col h-full overflow-hidden">
          {/* Poster Image Container */}
          <div className="relative aspect-[3/4] w-full overflow-hidden border-b-2 border-border bg-surface-muted">
            <AnimeImage
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, (max-width: 1440px) 18vw, 14vw"
              src={src}
              alt={alt || title}
              loading={eager ? "eager" : "lazy"}
              priority={priority}
              fetchPriority={priority ? "high" : undefined}
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />

            {/* Floating Bookmark Button */}
            {slug && (
              <span className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 z-10">
                <BookmarkButton
                  slug={slug}
                  title={title}
                  image={src}
                  release={meta}
                  genres={genres}
                  className="!h-8 !w-8 rounded-sm border-2 border-border bg-surface text-ink shadow-[2px_2px_0_0_var(--border)] hover:bg-nb-yellow hover:text-nb-ink"
                />
              </span>
            )}

            {/* Release / Status Badge */}
            {meta && (
              <span className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 z-10 flex items-center gap-1 rounded-sm border-2 border-border bg-nb-yellow px-1.5 sm:px-2 py-0.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-nb-ink shadow-[2px_2px_0_0_var(--border)] max-w-[calc(100%-0.75rem)]">
                {isOngoing && <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-nb-ink" />}
                {isCompleted && <span className="text-[10px] font-bold">✓</span>}
                <span className="truncate">{meta}</span>
              </span>
            )}

            {/* Quick View Hover Band */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between border-t-2 border-border bg-nb-ink px-2 pt-1.5 pb-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <span className="font-display text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-nb-cream">
                Lihat →
              </span>
              <span className="rounded-sm border border-nb-cream/50 px-1 py-0.2 font-mono text-[7px] sm:text-[8px] font-bold text-nb-cream uppercase">
                Detail
              </span>
            </div>
          </div>

          {/* Title and Genre Area */}
          <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between min-w-0 gap-1">
            <h3
              translate="no"
              className="line-clamp-2 font-display text-[11px] sm:text-xs md:text-[13px] font-bold leading-snug break-words group-hover:underline decoration-2 underline-offset-2"
            >
              {title}
            </h3>
            {genres && genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 overflow-hidden">
                {genres.slice(0, 2).map((g) => (
                  <span
                    key={g}
                    className="rounded-sm border border-nb-ink/50 bg-white/50 px-1.5 py-0.2 font-mono text-[8px] sm:text-[8.5px] text-nb-ink truncate max-w-[80px]"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ViewTransitionLink>
  );
};

export default CardAnime;
