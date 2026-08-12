import AnimeImage from "@/components/anime-image";
import Reveal from "@/components/reveal";
import { loadRecommendations } from "@/lib/loaders";
import { Recommendation } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import Link from "next/link";
import { JSX } from "react";

const RecommendedAnime = async (): Promise<JSX.Element> => {
  const recommendations = await loadRecommendations();

  return (
    <div className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {(recommendations ?? []).map((item: Recommendation, index: number) => {
        const endpoint = item.endpoint ? animeSlug(item.endpoint) : null;
        if (!endpoint) return null;

        return (
          <Link
            key={index}
            href={`/anime/${endpoint}`}
            className="card-shell group block w-36 shrink-0 snap-start sm:w-40"
          >
            <div className="card-core">
              <div className="relative aspect-[3/4] w-full">
                <AnimeImage
                  fill
                  sizes="160px"
                  src={item.image as string}
                  alt={item.title}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
              </div>
              <div className="p-3">
                <h4 className="line-clamp-2 text-xs font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-accent">
                  {item.title}
                </h4>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RecommendedAnime;
