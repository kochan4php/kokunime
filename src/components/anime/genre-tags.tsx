import { Genre } from "@/interfaces";
import { JSX } from "react";

const chipColors = ["bg-accent/10 text-accent", "bg-accent-2/10 text-accent-2", "bg-accent-amber/10 text-accent-amber"];

const GenreTags = ({ anime }: any): JSX.Element => (
  <div className="flex flex-wrap gap-2">
    {(anime.genre ?? []).map((item: Genre, index: number) => (
      <span
        key={index}
        className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider ${chipColors[index % chipColors.length]}`}
      >
        {item.name}
      </span>
    ))}
  </div>
);

export default GenreTags;
