import kusonime from "@/config/kusonime";
import { Genre } from "@/interfaces";
import logger from "@/utils/logger";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parseSimplePagination } from "./parse-simple-pagination";
import { KUSONIME_URL } from "./constants";

export async function getGenres(): Promise<Genre[] | null> {
  try {
    const response = await kusonime.get("/genres");
    const $ = load(response.data);
    const genres: Genre[] = [];
    const element = $(".venser > .venutama");

    $(element)
      .find("ul.genres > li")
      .each((_, el) => {
        const obj = {
          name: $(el).find("a").text(),
          endpoint: $(el).find("a").attr("href")?.replace(KUSONIME_URL, ""),
          url: $(el).find("a").attr("href"),
        };

        genres.push(obj);
      });

    genres.splice(0, 1);
    return genres;
  } catch (err: any) {
    logger.log("Error", err.message, err.stack);
    return null;
  }
}

export async function getAnimeByGenres(genre: string, page: number | string) {
  try {
    const response = await kusonime.get(`/genres/${genre}/page/${page}`);
    const $ = load(response.data);

    return { anime: formatAnimeData($), pagination: parseSimplePagination($, Number(page)) };
  } catch (err: any) {
    logger.log("Error", err.message, err.stack);
    return null;
  }
}
