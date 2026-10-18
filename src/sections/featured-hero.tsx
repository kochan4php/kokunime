"use client";

import AnimeImage from "@/components/cards/anime-image";
import ViewTransitionLink from "@/components/view-transition-link";
import { DownloadIcon } from "@/components/icons";
import { Anime } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import { JSX, useEffect, useState } from "react";

interface FeaturedHeroProps {
  featured?: Anime | undefined;
  items?: Anime[] | undefined;
  blurDataURL?: string | undefined;
}

const FeaturedHero = ({ featured, items = [], blurDataURL }: FeaturedHeroProps): JSX.Element => {
  const list = items.length > 0 ? items.slice(0, 5) : featured ? [featured] : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (list.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [list.length]);

  const current = list[activeIndex] ?? featured;
  const slug = current?.link?.endpoint ? animeSlug(current.link.endpoint) : "";

  return (
    <div className="card-shell group relative overflow-hidden border-[3px] shadow-[6px_6px_0_0_var(--border)] hover:shadow-[8px_8px_0_0_var(--border)]">
      <div className="card-core">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-border md:aspect-auto md:min-h-[26rem] md:border-b-0 md:border-r-2">
            {current?.link?.image && (
              <AnimeImage
                key={current.title}
                fill
                priority={activeIndex === 0}
                {...(activeIndex === 0 ? { fetchPriority: "high" as const } : {})}
                {...(activeIndex === 0 && blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
                sizes="(max-width: 768px) 100vw, 50vw"
                src={current.link.image}
                alt={current.title}
                className="transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]"
              />
            )}
            <div className="absolute left-5 top-5 flex items-center gap-2">
              <span className="rounded-sm border-2 border-border bg-nb-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-nb-cream shadow-[2px_2px_0_0_var(--border)]">
                Update Unggulan
              </span>
              {list.length > 1 && (
                <span className="rounded-sm border-2 border-border bg-nb-pink px-2 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
                  {activeIndex + 1} / {list.length}
                </span>
              )}
            </div>
            {list.length > 1 && (
              <div className="absolute bottom-4 left-5 z-10 flex items-center gap-1.5">
                {list.map((item, idx) => (
                  <button
                    key={item.title || idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Slide ke ${idx + 1}`}
                    className={`h-2.5 rounded-sm border border-nb-ink transition-all duration-200 cursor-pointer ${
                      activeIndex === idx ? "w-7 bg-nb-yellow" : "w-2.5 bg-nb-cream/80 hover:bg-nb-cream"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="nb-halftone flex flex-col justify-center gap-3 sm:gap-4 border-t-2 border-border bg-nb-yellow p-5 sm:p-8 md:border-t-0 md:p-12 min-w-0">
            <h1 className="min-h-[3.15em] font-display text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-nb-ink break-words line-clamp-3 sm:text-4xl md:text-6xl">
              {current?.title ?? "Katalog anime"}
            </h1>
            {/* Fixed-height slot: slides swap genre chips for release text, and
                an unreserved slot makes every 6s rotation a layout shift. */}
            <div className="min-h-[2.75rem]">
              {current?.genres?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {current.genres.slice(0, 4).map((genre) => (
                    <span
                      key={genre}
                      className="rounded-sm border-2 border-nb-ink bg-nb-cream/70 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-nb-ink"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-semibold text-nb-ink/80 leading-relaxed text-xs sm:text-sm line-clamp-2">
                  {current?.release ?? "Daftar lengkapnya ada di bawah."}
                </p>
              )}
            </div>
            {slug && (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <ViewTransitionLink
                  href={`/anime/${slug}#download`}
                  className="btn-primary w-full sm:w-max justify-center"
                >
                  Download Anime
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm border-2 border-nb-ink bg-nb-ink text-nb-cream transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0.5">
                    <DownloadIcon className="h-3.5 w-3.5" />
                  </span>
                </ViewTransitionLink>
                <ViewTransitionLink href={`/anime/${slug}`} className="btn-secondary w-full sm:w-max justify-center">
                  Lihat Detail →
                </ViewTransitionLink>
                {list.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveIndex((prev) => (prev - 1 + list.length) % list.length)}
                      aria-label="Anime sebelumnya"
                      className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-border bg-surface text-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer text-sm font-bold"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveIndex((prev) => (prev + 1) % list.length)}
                      aria-label="Anime berikutnya"
                      className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-border bg-surface text-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer text-sm font-bold"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedHero;
