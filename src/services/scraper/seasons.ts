import upstream from "@/config/upstream";
import { AnimePage, Season } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parseSimplePagination } from "./parse-simple-pagination";
import parseTaxonomy from "./parse-taxonomy";

export async function getSeasons(): Promise<Season[]> {
  return parseTaxonomy("/seasons-list", "seasons", TTL.seasons) as Promise<Season[]>;
}

export async function getAnimeBySeasons(season: string, page: number | string): Promise<AnimePage> {
  return cached(
    `anime-by-season:${season}:${page}`,
    TTL.bySeason,
    async () => {
      const response = await upstream.get(`/seasons/${season}/page/${page}`);
      // upstream redirects unknown seasons/pages to the homepage — detect and bail.
      const finalUrl: string = (response.request as { res?: { responseUrl?: string } }).res?.responseUrl ?? "";
      if (!finalUrl.includes(`/seasons/${season}/`)) {
        return { anime: [], pagination: null };
      }
      const $ = load(response.data);

      return { anime: formatAnimeData($), pagination: parseSimplePagination($, Number(page)) };
    },
    { anime: [], pagination: null },
  );
}
