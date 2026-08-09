import kusonime from "@/config/kusonime";
import { Anime } from "@/interfaces";
import logger from "@/utils/logger";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";

export async function searchAnime(query: string) {
  try {
    const response = await kusonime.get(`/?s=${query}&post_type=post`);
    const $ = load(response.data);
    const anime = formatAnimeData($);

    return anime;
  } catch (err: any) {
    logger.log("Error", err.message, err.stack);
    return {} as Anime[];
  }
}
