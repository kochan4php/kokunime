import kusonime from "@/config/kusonime";
import { Recommendation } from "@/interfaces";
import logger from "@/utils/logger";
import { load } from "cheerio";
import { KUSONIME_URL } from "./constants";

export async function getRecommendations(): Promise<Recommendation[]> {
  try {
    const response = await kusonime.get("/");
    const $ = load(response.data);
    const recommendedAnime: Recommendation[] = [];
    const element = $(".rekomf");

    $(element)
      .find(".recomx > ul > li")
      .each((_, el) => {
        const obj = {
          title: $(el).find(".zeeb > a > img").attr("title"),
          endpoint: $(el).find(".zeeb > a").attr("href")?.replace(KUSONIME_URL, ""),
          image: $(el).find(".zeeb > a > img").attr("src"),
          url: $(el).find(".zeeb > a").attr("href"),
        };

        recommendedAnime.push(obj);
      });

    return recommendedAnime;
  } catch (err: any) {
    logger.log("Error", err.message, err.stack);
    return [] as Recommendation[];
  }
}
