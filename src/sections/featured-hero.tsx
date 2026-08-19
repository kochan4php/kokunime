"use client";

import AnimeImage from "@/components/cards/anime-image";
import { DownloadIcon } from "@/components/icons";
import { Anime } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";

interface FeaturedHeroProps {
  featured?: Anime;
  items?: Anime[];
}

const FeaturedHero = ({ featured, items = [] }: FeaturedHeroProps): JSX.Element => {
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
    <div className="card-shell group relative overflow-hidden">
      <div className="card-core">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[26rem]">
            {current?.link?.image && (
              <AnimeImage
                key={current.title}
                fill
                priority={activeIndex === 0}
                fetchPriority={activeIndex === 0 ? "high" : undefined}
                sizes="(max-width: 768px) 100vw, 50vw"
                src={current.link.image}
                alt={current.title}
                className="transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r" />
            <div className="absolute left-5 top-5 flex items-center gap-2">
              <span className="rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white backdrop-blur-xs">
                Update Unggulan
              </span>
              {list.length > 1 && (
                <span className="rounded-full bg-accent/80 px-2 py-0.5 font-mono text-[10px] font-bold text-(--accent-ink)">
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
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIndex === idx ? "w-6 bg-accent" : "w-2 bg-white/50 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-4 p-7 md:p-12">
            <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-ink md:text-5xl">
              {current?.title ?? "Katalog anime"}
            </h1>
            <p className="text-ink-muted leading-relaxed">
              {current?.genres?.length
                ? current.genres.join(" · ")
                : (current?.release ?? "Daftar lengkapnya ada di bawah.")}
            </p>
            {slug && (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Link href={`/anime/${slug}`} className="btn-primary w-max">
                  Download Anime
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/15 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0.5">
                    <DownloadIcon className="h-3.5 w-3.5" />
                  </span>
                </Link>
                {list.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveIndex((prev) => (prev - 1 + list.length) % list.length)}
                      aria-label="Anime sebelumnya"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink-muted hover:border-accent hover:text-ink cursor-pointer text-sm"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveIndex((prev) => (prev + 1) % list.length)}
                      aria-label="Anime berikutnya"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink-muted hover:border-accent hover:text-ink cursor-pointer text-sm"
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
