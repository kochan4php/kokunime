import kusonime from "@/config/kusonime";
import { Season } from "@/interfaces";
import logger from "@/utils/logger";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parseSimplePagination } from "./parse-simple-pagination";
import { KUSONIME_URL } from "./constants";

export async function getSeasons(): Promise<Season[] | null> {
  try {
    const response = await kusonime.get("/seasons-list");
    const $ = load(response.data);
    const seasons: Season[] = [];
    const element = $(".venser > .venutama");

    $(element)
      .find("ul.genres > li")
      .each((_, el) => {
        const obj = {
          name: $(el).find("a").text(),
          endpoint: $(el).find("a").attr("href")?.replace(KUSONIME_URL, ""),
          url: $(el).find("a").attr("href"),
        };

        seasons.push(obj);
      });

    seasons.splice(0, 1);
    return seasons;
  } catch (err: any) {
    logger.log("Error", err.message, err.stack);
    return null;
  }
}

export async function getAnimeBySeasons(season: string, page: number | string) {
  try {
    const response = await kusonime.get(`/seasons/${season}/page/${page}`);
    const $ = load(response.data);

    return { anime: formatAnimeData($), pagination: parseSimplePagination($, Number(page)) };
  } catch (err: any) {
    logger.log("Error", err.message, err.stack);
    return null;
  }
}
