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
    const cleanSeason = decodeURIComponent(season).trim().toLowerCase();
    const pageNum = Math.max(1, Number(page) || 1);
    const path = pageNum > 1 ? `/seasons/${cleanSeason}/page/${pageNum}` : `/seasons/${cleanSeason}`;
    const response = await upstream.get(path);

    // upstream redirects unknown seasons/pages to the homepage — detect and bail.
    const finalUrl = (response.url ?? "").toLowerCase();
    if (!finalUrl.includes(`/seasons/${cleanSeason}`) && !finalUrl.includes(`season=${cleanSeason}`)) {
      return { anime: [], pagination: null };
    }
    const $ = load(stripHtmlNoise(response.data));

    return { anime: formatAnimeData($), pagination: parseSimplePagination($, pageNum) };
  } catch {
    return { anime: [], pagination: null };
  }
}
