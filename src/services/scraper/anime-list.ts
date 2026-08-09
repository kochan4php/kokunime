import kusonime from "@/config/kusonime";
import { AnimePage } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parsePagination } from "./parse-pagination";

export async function getAnimePerPage(page: number): Promise<AnimePage> {
  return cached(`anime:${page}`, TTL.anime, async () => {
    const response = await kusonime.get(`/page/${page}`);
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
  });
}
