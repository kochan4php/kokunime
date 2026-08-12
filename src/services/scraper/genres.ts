import kusonime from "@/config/kusonime";
import { AnimePage, Genre } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parseSimplePagination } from "./parse-simple-pagination";
import parseTaxonomy from "./parse-taxonomy";

export async function getGenres(): Promise<Genre[]> {
  return parseTaxonomy("/genres", "genres", TTL.genres) as Promise<Genre[]>;
}

export async function getAnimeByGenres(genre: string, page: number | string): Promise<AnimePage> {
  return cached(
    `anime-by-genre:${genre}:${page}`,
    TTL.byGenre,
    async () => {
      const response = await kusonime.get(`/genres/${genre}/page/${page}`);
      // kusonime redirects unknown genres/pages to the homepage — detect and bail.
      const finalUrl: string = (response.request as { res?: { responseUrl?: string } }).res?.responseUrl ?? "";
      if (!finalUrl.includes(`/genres/${genre}/`)) {
        return { anime: [], pagination: null };
      }
      const $ = load(response.data);

      return { anime: formatAnimeData($), pagination: parseSimplePagination($, Number(page)) };
    },
    { anime: [], pagination: null },
  );
}
