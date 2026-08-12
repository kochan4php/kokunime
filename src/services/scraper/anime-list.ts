import kusonime from "@/config/kusonime";
import { AnimePage } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parsePagination } from "./parse-pagination";

export async function getAnimePerPage(page: number): Promise<AnimePage> {
  return cached(
    `anime:${page}`,
    TTL.anime,
    async () => {
      const response = await kusonime.get(`/page/${page}`);
      // kusonime redirects out-of-range pages (e.g. /page/999) to the homepage — detect and bail.
      const finalUrl: string = (response.request as { res?: { responseUrl?: string } }).res?.responseUrl ?? "";
      if (page > 1 && !finalUrl.includes(`/page/${page}`)) {
        return { anime: [], pagination: null };
      }
      const $ = load(response.data);
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

      return { anime, pagination } as AnimePage;
    },
    { anime: [], pagination: null },
  );
}
