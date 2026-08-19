import AnimeImage from "@/components/cards/anime-image";
import BookmarkButton from "@/components/anime/bookmark-button";
import { ArrowUpRightIcon } from "@/components/icons";
import { AnimeCardProps } from "@/interfaces";
import Link from "next/link";
import { JSX } from "react";

const CardAnime = ({ src, alt, title, meta, path, eager = false, priority = false }: AnimeCardProps): JSX.Element => {
  const slug = path.startsWith("/anime/") ? path.replace("/anime/", "") : undefined;

  return (
    <Link href={path} className="group block h-full">
      <div className="card-shell group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_-24px_var(--glow-accent)]">
        <div className="card-core">
          <div className="relative aspect-[3/4] w-full">
            <AnimeImage
              fill
              sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 20vw"
              src={src}
              alt={alt || title}
              loading={eager ? "eager" : "lazy"}
              priority={priority}
              fetchPriority={priority ? "high" : undefined}
              className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10" />
            {slug && (
              <span className="absolute left-2.5 top-2.5 z-10 opacity-70 transition-opacity duration-200 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100">
                <BookmarkButton
                  slug={slug}
                  title={title}
                  image={src}
                  release={meta}
                  className="!h-8 !w-8 bg-black/60 backdrop-blur-sm border-white/15 text-white"
                />
              </span>
            )}
            <span className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-white backdrop-blur-xs">
              {/menit|jam|pm|am|today|hari|ongoing/i.test(meta || "") && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
              )}
              <span className="truncate max-w-[85px] sm:max-w-[140px]">{meta}</span>
            </span>
            <div className="absolute inset-x-0 bottom-0 p-3 pt-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-between">
              <span className="font-display text-[11px] font-bold text-accent">Lihat Anime →</span>
              <span className="rounded-md bg-white/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white uppercase backdrop-blur-xs">
                Quick View
              </span>
            </div>
            <span className="absolute right-3 top-3 flex h-8 w-8 -translate-x-1 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowUpRightIcon />
            </span>
          </div>
          <div className="p-3 sm:p-4 min-w-0">
            <h2 className="line-clamp-2 text-xs sm:text-sm font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-accent break-words">
              {title}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardAnime;
