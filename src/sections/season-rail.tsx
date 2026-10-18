import AnimeImage from "@/components/cards/anime-image";
import { getAnimeBySeasons } from "@/services/scraper";
import { endpointSlug } from "@/utils/endpoint-slug";
import Link from "next/link";
import { JSX } from "react";

interface SeasonRailProps {
  seasonSlug: string;
  seasonName?: string | undefined;
  excludeSlug: string;
  heading?: string;
  kicker?: string;
}

// "Juga dari musim ini" — server-rendered rail from the season listing the
// detail page already tells us about (anime.season.endpoint). Hidden when the
// upstream fetch fails or the rail would only contain the current title.
const SeasonRail = async ({
  seasonSlug,
  seasonName,
  excludeSlug,
  heading = "🗓️ Juga dari",
  kicker = "musim ini",
}: SeasonRailProps): Promise<JSX.Element | null> => {
  const result = await getAnimeBySeasons(seasonSlug, 1).catch(() => null);
  if (!result) return null;

  const list = (result.anime ?? [])
    .map((item) => ({
      slug: endpointSlug(item?.link?.endpoint, "anime"),
      title: item.title ?? "",
      image: item?.link?.image as string | undefined,
    }))
    .filter((item): item is { slug: string; title: string; image: string | undefined } =>
      Boolean(item.slug && item.title && item.slug !== excludeSlug),
    )
    .slice(0, 12);
  if (list.length < 2) return null;

  return (
    <section className="container px-4 pt-10" aria-labelledby="season-rail-title">
      <div className="mb-4 flex items-center gap-2">
        <h2 id="season-rail-title" className="font-display text-lg font-extrabold tracking-tight text-ink md:text-xl">
          {heading} {seasonName ? seasonName : "musim yang sama"}
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">{kicker}</span>
      </div>
      <div className="nb-cycle flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {list.map((item) => (
          <Link
            key={item.slug}
            href={`/anime/${item.slug}`}
            className="card-shell group block w-32 shrink-0 snap-start sm:w-36"
          >
            <div className="card-core">
              <div className="relative aspect-[3/4] w-full border-b-2 border-border">
                <AnimeImage
                  fill
                  sizes="144px"
                  src={item.image as string}
                  alt={item.title}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                />
              </div>
              <div className="p-2.5">
                <h3 className="line-clamp-2 text-[11px] font-semibold leading-snug group-hover:underline decoration-2 underline-offset-2">
                  {item.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SeasonRail;
