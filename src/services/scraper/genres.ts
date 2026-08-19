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
    const cleanGenre = decodeURIComponent(genre).trim().toLowerCase();
    const pageNum = Math.max(1, Number(page) || 1);
    const path = pageNum > 1 ? `/genres/${cleanGenre}/page/${pageNum}` : `/genres/${cleanGenre}`;
    const response = await upstream.get(path);

    // upstream redirects unknown genres/pages to the homepage — detect and bail.
    const finalUrl = (response.url ?? "").toLowerCase();
    if (!finalUrl.includes(`/genres/${cleanGenre}`) && !finalUrl.includes(`genre=${cleanGenre}`)) {
      return { anime: [], pagination: null };
    }
    const $ = load(stripHtmlNoise(response.data));

    return { anime: formatAnimeData($), pagination: parseSimplePagination($, pageNum) };
  } catch {
    return { anime: [], pagination: null };
  }
}
