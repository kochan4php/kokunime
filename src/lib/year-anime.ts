import { Anime } from "@/interfaces";
import { getAnimeBySeasons, getSeasons } from "@/services/scraper";
import { endpointSlug } from "@/utils/endpoint-slug";

// A year page (and its feed) aggregates every season slug ending in that year;
// results are deduped by endpoint/title. Shared so page and feed agree.
export const collectYearAnime = async (year: string): Promise<Anime[]> => {
  const seasons = (await getSeasons())
    .map((season) => endpointSlug(season.endpoint, "seasons"))
    .filter((slug): slug is string => Boolean(slug?.endsWith(`-${year}`)));

  const results = await Promise.allSettled(seasons.map((slug) => getAnimeBySeasons(slug, 1)));
  const seen = new Set<string>();
  const anime: Anime[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value.anime ?? []) {
      const key = item.link?.endpoint ?? item.title;
      if (seen.has(key)) continue;
      seen.add(key);
      anime.push(item);
    }
  }

  return anime;
};
