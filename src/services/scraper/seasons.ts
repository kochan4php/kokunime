import upstream from "@/config/upstream";
import { AnimePage, Season } from "@/interfaces";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parseSimplePagination } from "./parse-simple-pagination";
import parseTaxonomy from "./parse-taxonomy";
import { stripHtmlNoise } from "./sanitize";

export async function getSeasons(): Promise<Season[]> {
  return parseTaxonomy("/seasons-list") as Promise<Season[]>;
}

export async function getAnimeBySeasons(season: string, page: number | string): Promise<AnimePage> {
  try {
    const response = await upstream.get(`/seasons/${season}/page/${page}`);
    // upstream redirects unknown seasons/pages to the homepage — detect and bail.
    const finalUrl: string = response.url ?? "";
    if (!finalUrl.includes(`/seasons/${season}/`)) {
      return { anime: [], pagination: null };
    }
    const $ = load(stripHtmlNoise(response.data));

    return { anime: formatAnimeData($), pagination: parseSimplePagination($, Number(page)) };
  } catch {
    return { anime: [], pagination: null };
  }
}
