import AnimeImage from "@/components/cards/anime-image";
import DetailMeta from "./detail-meta";
import GenreTags from "./genre-tags";
import blurDataUrl from "@/data/blur-data-url";
import { AnimeDetail } from "@/interfaces";
import { JSX } from "react";

const DetailHero = ({ anime }: { anime: AnimeDetail }): JSX.Element => (
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
            placeholder="blur"
            blurDataURL={blurDataUrl}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {anime.score && (
          <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 font-mono text-xs font-medium text-white">
            Skor {anime.score}
          </span>
        )}
      </div>
      <div className="p-7 md:p-10">
        <GenreTags anime={anime} />
        <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-ink md:text-4xl">
          {anime.title}
        </h1>
        <p className="mt-2 text-ink-muted">{anime.release_on}</p>
        <DetailMeta anime={anime} />
      </div>
    </div>
  </div>
);

export default DetailHero;
