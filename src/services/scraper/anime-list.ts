import kusonime from "@/config/kusonime";
import { AnimePage } from "@/interfaces";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parsePagination } from "./parse-pagination";
import { stripHtmlNoise } from "./sanitize";

export async function getAnimePerPage(page: number): Promise<AnimePage> {
  try {
    const response = await kusonime.get(`/page/${page}`);
    // upstream redirects out-of-range pages (e.g. /page/999) to the homepage — detect and bail.
    const finalUrl: string = response.url ?? "";
    if (page > 1 && !finalUrl.includes(`/page/${page}`)) {
      return { anime: [], pagination: null };
    }
    const $ = load(stripHtmlNoise(response.data));
    const anime = formatAnimeData($);
    const pagination = parsePagination($) ?? {
      first_page_endpoint: "page/1",
      next_page_endpoint: null,
      current_page: page,
      pages_of: "",
      total_page: 1,
      prev_page_endpoint: null,
      last_page_endpoint: "page/1",
    };

    return { anime, pagination };
  } catch {
    return { anime: [], pagination: null };
  }
}
