import AnimeImage from "@/components/anime-image";
import Reveal from "@/components/reveal";
import { loadAnimePage } from "@/lib/loaders";
import { Anime } from "@/interfaces";
import Link from "next/link";
import { JSX } from "react";

const NewSeriesAnime = async (props: any): Promise<JSX.Element> => {
  const slug: string = props.slug;
  const getNewSeriesAnime = await loadAnimePage(1);
  const newSeriesAnime = getNewSeriesAnime.anime?.filter((data: Anime) => !data?.link?.endpoint?.includes(slug));

  return (
    <div className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {newSeriesAnime?.map((item: Anime, index: number) => (
        <Link
          key={index}
          href={`/anime/${item.link.endpoint?.split("/").join(" ").trim()}`}
          className="card-shell group block w-32 shrink-0 snap-start sm:w-36"
        >
          <div className="card-core">
            <div className="relative aspect-[3/4] w-full">
              <AnimeImage
                fill
                sizes="144px"
                src={item.link.image as string}
                alt=""
                className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
            </div>
            <div className="p-2.5">
              <h4 className="line-clamp-2 text-[11px] font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-accent">
                {item.title}
              </h4>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NewSeriesAnime;
