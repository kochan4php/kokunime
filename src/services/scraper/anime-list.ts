import kusonime from "@/config/kusonime";
import { AnimePage } from "@/interfaces";
import logger from "@/utils/logger";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";

export async function getAnimePerPage(page: number): Promise<AnimePage> {
  try {
    const response = await kusonime.get(`/page/${page}`);
    const $ = load(response.data);
    const anime = formatAnimeData($);

    const element = $(".venutama");
    const current_page = Number($(element).find(".pagination .wp-pagenavi .current").text());
    const total_page = Number($(element).find(".pagination .wp-pagenavi .pages").text().split("of")[1].trim());

    const pagination = {
      first_page_endpoint: "page/1",
      next_page_endpoint: current_page === total_page ? null : `page/${current_page + 1}`,
      current_page,
      pages_of: $(element).find(".pagination .wp-pagenavi .pages").text(),
      total_page,
      prev_page_endpoint: current_page > 1 ? `page/${current_page - 1}` : null,
      last_page_endpoint: `page/${total_page}`,
    };

    return { anime, pagination } as AnimePage;
  } catch (err: any) {
    logger.log("Error", err.message, err.stack);
    return {} as AnimePage;
  }
}
