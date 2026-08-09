import MainController from "@/controllers/main.controller";
import blurDataUrl from "@/data/blur-data-url";
import { AnimeType } from "@/interfaces";
import Reveal from "@/components/Reveal";
import isGif from "@/utils/isGif";
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";

const ArrowRight = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const NewSeriesAnime = async (props: any): Promise<JSX.Element> => {
  const slug: string = props.slug;
  const getNewSeriesAnime = await MainController.getAnimePerPage(1);
  const newSeriesAnime = getNewSeriesAnime.anime?.filter((data: AnimeType) => !data?.link?.endpoint?.includes(slug));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {newSeriesAnime?.map((item: AnimeType, index: number) => (
        <Reveal key={index} className="h-full" delay={Math.min(index * 60, 360)}>
          <Link href={`/anime/${item.link.endpoint?.split("/").join(" ").trim()}`} className="card-shell group block">
            <div className="card-core flex items-center gap-4 p-3">
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                <Image
                  fill
                  sizes="56px"
                  src={item.link.image as string}
                  alt=""
                  unoptimized={isGif(item.link.image)}
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  loading="lazy"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="line-clamp-2 text-sm font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
                  {item.title}
                </h4>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">{item.release}</p>
              </div>
              <span className="shrink-0 text-ink-muted transition-colors duration-200 group-hover:text-accent">
                <ArrowRight />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
};

export default NewSeriesAnime;
