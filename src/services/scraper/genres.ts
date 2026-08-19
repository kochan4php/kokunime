import upstream from "@/config/upstream";
import { AnimePage, Genre } from "@/interfaces";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parseSimplePagination } from "./parse-simple-pagination";
import parseTaxonomy from "./parse-taxonomy";
import { stripHtmlNoise } from "./sanitize";

export async function getGenres(): Promise<Genre[]> {
  return parseTaxonomy("/genres") as Promise<Genre[]>;
}

export async function getAnimeByGenres(genre: string, page: number | string): Promise<AnimePage> {
  try {
    const response = await upstream.get(`/genres/${genre}/page/${page}`);
    // upstream redirects unknown genres/pages to the homepage — detect and bail.
    const finalUrl: string = response.url ?? "";
    if (!finalUrl.includes(`/genres/${genre}/`)) {
      return { anime: [], pagination: null };
    }
    const $ = load(stripHtmlNoise(response.data));

    return { anime: formatAnimeData($), pagination: parseSimplePagination($, Number(page)) };
  } catch {
    return { anime: [], pagination: null };
  }
}
