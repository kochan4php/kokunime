import CardAnime from "@/components/card-anime";
import Reveal from "@/components/reveal";
import { Anime } from "@/interfaces";
import { JSX } from "react";

interface AnimeGridProps {
  anime: Anime[];
  eagerCount?: number;
}

const AnimeGrid = ({ anime, eagerCount = 0 }: AnimeGridProps): JSX.Element => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
    {anime.map((item: Anime, index: number) => (
      <Reveal key={index} className="h-full" delay={(index % 5) * 80}>
        <CardAnime
          path={`/anime/${item?.link?.endpoint?.split("/").join(" ").trim()}`}
          src={item?.link?.image as string}
          title={item?.title}
          meta={item?.release}
          eager={index < eagerCount}
        />
      </Reveal>
    ))}
  </div>
);

export default AnimeGrid;
