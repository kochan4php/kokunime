import CardAnime from "@/components/cards/card-anime";
import Reveal from "@/components/reveal";
import { Anime } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import { Fragment, JSX } from "react";

interface AnimeGridProps {
  anime: Anime[];
  eagerCount?: number;
}

const AnimeGrid = ({ anime, eagerCount = 0 }: AnimeGridProps): JSX.Element => (
  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
    {anime.map((item: Anime, index: number) => {
      const endpoint = animeSlug(item?.link?.endpoint);
      if (!endpoint) return null;

      const eager = index < eagerCount;
      const card = (
        <CardAnime
          path={`/anime/${endpoint}`}
          src={item?.link?.image as string}
          title={item?.title}
          meta={item?.release}
          eager={eager}
          // First card is the LCP candidate on listing pages (genre/season/
          // search have no hero image) — fetchpriority=high beats the
          // default-priority request queue.
          priority={index === 0}
        />
      );

      // Eager cards are the above-fold ones — on genre/season/search pages the
      // first card IS the LCP element, and Reveal's SSR opacity-0 delayed it
      // ~1s. Below-fold cards keep the scroll-reveal animation.
      return eager ? (
        <Fragment key={index}>{card}</Fragment>
      ) : (
        <Reveal key={index} className="h-full" delay={(index % 5) * 80}>
          {card}
        </Reveal>
      );
    })}
  </div>
);

export default AnimeGrid;
