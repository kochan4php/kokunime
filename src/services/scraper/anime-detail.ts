import kusonime from "@/config/kusonime";
import logger from "@/utils/logger";
import { load } from "cheerio";
import { parseAnimeDetail } from "./parse";

export async function getAnimeDetail(slug: string) {
  try {
    const response = await kusonime.get(`/${slug}`);
    const $ = load(response.data);
    return parseAnimeDetail($);
  } catch (err: any) {
    logger.log("Error", err.message, err.stack);
    return {};
  }
}
