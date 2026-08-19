import AnimeImage from "@/components/cards/anime-image";
import DetailMeta from "./detail-meta";
import GenreTags from "./genre-tags";
import BookmarkButton from "./bookmark-button";
import ShareButton from "./share-button";
import TrailerButton from "./trailer-button";
import CopyButton from "./copy-button";
import { AnimeDetail } from "@/interfaces";
import { JSX } from "react";

import { VerticalJapaneseTitle } from "./vertical-japanese-title";

interface DetailHeroProps {
  anime: AnimeDetail;
  slug?: string;
}

const DetailHero = ({ anime, slug }: DetailHeroProps): JSX.Element => (
  <div className="relative">
    {anime.image && (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 sm:-inset-8 -z-10 rounded-[2.5rem] opacity-25 dark:opacity-20 blur-3xl transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${anime.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    )}
    <div className="card-shell">
      <div className="card-core grid md:grid-cols-[320px_1fr]">
        <div className="relative aspect-[3/4] md:aspect-auto md:min-h-full">
          {anime.image && (
            <AnimeImage
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 320px"
              src={anime.image}
              alt={anime.title ?? ""}
            />
          )}
          <VerticalJapaneseTitle japanese={anime.japanese} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {anime.score && (
            <span
              className={`absolute bottom-4 left-4 flex items-center gap-1 rounded-full px-3 py-1 font-mono text-xs font-bold backdrop-blur-sm ${
                parseFloat(anime.score) >= 8.0
                  ? "bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                  : parseFloat(anime.score) >= 7.0
                    ? "bg-emerald-500 text-white"
                    : "bg-black/70 text-white"
              }`}
            >
              ⭐ Skor {anime.score}
            </span>
          )}
        </div>
        <div className="p-7 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <GenreTags anime={anime} />
              <div className="flex flex-wrap items-center gap-2">
                <TrailerButton trailerUrl={anime.trailer} title={anime.title ?? ""} />
                {slug && (
                  <BookmarkButton
                    slug={slug}
                    title={anime.title ?? ""}
                    image={anime.image}
                    release={anime.release_on}
                    showLabel
                  />
                )}
                <ShareButton title={anime.title ?? ""} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-ink md:text-4xl">
                {anime.title}
              </h1>
              {anime.title && (
                <CopyButton
                  text={anime.title}
                  label="Salin Judul"
                  copiedLabel="✓ Judul Tersalin"
                  className="!text-[10px] !py-0.5 !px-2.5"
                />
              )}
            </div>
            {anime.japanese && <p className="mt-1 font-mono text-xs text-ink-muted/80">{anime.japanese}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {anime.status && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
                    /complete/i.test(anime.status)
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {/ongoing/i.test(anime.status) ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  ) : (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        /complete/i.test(anime.status) ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                  )}
                  {anime.status}
                </span>
              )}
              {anime.rating && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-amber-500">
                  🛡️ {anime.rating}
                </span>
              )}
              {anime.type && (
                <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[11px] font-medium text-ink-muted">
                  {anime.type}
                </span>
              )}
              {anime.total_episode && (
                <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[11px] font-medium text-ink-muted">
                  {anime.total_episode}
                </span>
              )}
              {anime.duration && (
                <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[11px] font-medium text-ink-muted">
                  {anime.duration}
                </span>
              )}
              {anime.title && (
                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://myanimelist.net/anime.php?q=${encodeURIComponent(anime.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Cari ${anime.title} di MyAnimeList`}
                    className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-200 active:scale-95"
                  >
                    <span>MAL ↗</span>
                  </a>
                  <a
                    href={`https://anilist.co/search/anime?search=${encodeURIComponent(anime.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Cari ${anime.title} di AniList`}
                    className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all duration-200 active:scale-95"
                  >
                    <span>AniList ↗</span>
                  </a>
                </div>
              )}
            </div>
            {anime.release_on && <p className="mt-2 text-xs text-ink-muted font-mono">{anime.release_on}</p>}
          </div>
          <DetailMeta anime={anime} />
        </div>
      </div>
    </div>
  </div>
);

export default DetailHero;
