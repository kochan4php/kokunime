import { endpointSlug } from "@/utils/endpoint-slug";
import { AnimeDetail, Genre } from "@/interfaces";
import Link from "next/link";
import { JSX } from "react";

const chipColors = ["bg-accent/10 text-accent", "bg-accent-2/10 text-accent-2", "bg-accent-amber/10 text-accent-amber"];

const GenreTags = ({ anime }: { anime: AnimeDetail }): JSX.Element => (
  <div className="flex flex-wrap gap-2">
    {anime.genre.map((item: Genre, index: number) => {
      const slug = endpointSlug(item.endpoint, "genres");
      const className = `rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider ${chipColors[index % chipColors.length]} transition-opacity duration-200 hover:opacity-70`;

      return slug ? (
        <Link key={index} href={`/genres/${slug}`} className={className}>
          {item.name}
        </Link>
      ) : (
        <span key={index} className={className}>
          {item.name}
        </span>
      );
    })}
  </div>
);

export default GenreTags;
