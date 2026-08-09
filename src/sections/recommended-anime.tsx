import { getRecommendations } from "@/lib/api-client";
import blurDataUrl from "@/data/blur-data-url";
import { RecommendationType } from "@/interfaces";
import isGif from "@/utils/is-gif";
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";

const RecommendedAnime = async (): Promise<JSX.Element> => {
  const recommendations = await getRecommendations();

  return (
    <div className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {(recommendations ?? []).map((item: RecommendationType, index: number) => {
        const path = item.endpoint ? `/anime/${item.endpoint.split("/").join(" ").trim()}` : "#";

        return (
          <Link key={index} href={path} className="card-shell group block w-36 shrink-0 snap-start sm:w-40">
            <div className="card-core">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-muted">
                <Image
                  fill
                  sizes="160px"
                  src={item.image as string}
                  alt=""
                  unoptimized={isGif(item.image)}
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  loading="lazy"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
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
