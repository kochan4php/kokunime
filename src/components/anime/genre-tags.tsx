import { endpointSlug } from "@/utils/endpoint-slug";
import { AnimeDetail, Genre } from "@/interfaces";
import Link from "next/link";
import { JSX } from "react";

const chipColors = ["bg-nb-yellow", "bg-nb-pink", "bg-nb-teal", "bg-nb-lime", "bg-nb-purple", "bg-nb-orange"];

const GenreTags = ({ anime }: { anime: AnimeDetail }): JSX.Element => (
  <div className="flex flex-wrap gap-2">
    {anime.genre.map((item: Genre, index: number) => {
      const slug = endpointSlug(item.endpoint, "genres");
      const className = `rounded-sm border-2 border-border px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-nb-ink shadow-[2px_2px_0_0_var(--border)] ${chipColors[index % chipColors.length]} transition-all duration-150 motion-safe:hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--border)] active:translate-y-0 active:shadow-none`;

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
