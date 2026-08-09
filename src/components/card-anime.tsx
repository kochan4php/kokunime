import AnimeImage from "@/components/anime-image";
import { ArrowUpRightIcon } from "@/components/icons";
import { AnimeCardProps } from "@/interfaces";
import Link from "next/link";
import { JSX } from "react";

const CardAnime = ({ src, alt, title, meta, path, eager = false }: AnimeCardProps): JSX.Element => (
  <Link href={path} className="group block h-full">
    <div className="card-shell group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_-24px_var(--glow-accent)]">
      <div className="card-core">
        <div className="relative aspect-[3/4] w-full">
          <AnimeImage
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
            src={src}
            alt={alt || title}
            loading={eager ? "eager" : "lazy"}
            className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10" />
          <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur-md">
            {meta}
          </span>
          <span className="absolute right-3 top-3 flex h-8 w-8 -translate-x-1 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowUpRightIcon />
          </span>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-accent">
            {title}
          </h3>
        </div>
      </div>
    </div>
  </Link>
);

export default CardAnime;
