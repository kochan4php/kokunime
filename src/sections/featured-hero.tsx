import AnimeImage from "@/components/anime-image";
import { DownloadIcon } from "@/components/icons";
import Reveal from "@/components/reveal";
import { Anime } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import Link from "next/link";
import { JSX } from "react";

const FeaturedHero = ({ featured }: { featured?: Anime }): JSX.Element => (
  <Reveal>
    <div className="card-shell group">
      <div className="card-core">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[26rem]">
            {featured?.link?.image && (
              <AnimeImage
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                src={featured.link.image}
                alt={featured.title}
                className="transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r" />
            <span className="absolute left-5 top-5 rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white">
              Update Terbaru
            </span>
          </div>
          <div className="flex flex-col justify-center gap-4 p-7 md:p-12">
            <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-ink md:text-5xl">
              {featured?.title ?? "Katalog anime"}
            </h1>
            <p className="text-ink-muted">
              {featured?.genres?.length
                ? featured.genres.join(" · ")
                : (featured?.release ?? "Daftar lengkapnya ada di bawah.")}
            </p>
            {featured?.link?.endpoint && animeSlug(featured.link.endpoint) && (
              <Link href={`/anime/${animeSlug(featured.link.endpoint)}`} className="btn-primary mt-2 w-max">
                Download Anime
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/15 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0.5">
                  <DownloadIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  </Reveal>
);

export default FeaturedHero;
