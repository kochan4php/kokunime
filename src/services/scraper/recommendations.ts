import kusonime from "@/config/kusonime";
import { Recommendation } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { KUSONIME_URL } from "./constants";

export async function getRecommendations(): Promise<Recommendation[]> {
  return cached("recommendations", TTL.recommendations, async () => {
    const response = await kusonime.get("/");
    const $ = load(response.data);
    const recommendedAnime: Recommendation[] = [];
    const element = $(".rekomf");

    $(element)
      .find(".recomx > ul > li")
      .each((_, el) => {
        recommendedAnime.push({
          title: $(el).find(".zeeb > a > img").attr("title"),
          endpoint: $(el).find(".zeeb > a").attr("href")?.replace(KUSONIME_URL, ""),
          image: $(el).find(".zeeb > a > img").attr("src"),
          url: $(el).find(".zeeb > a").attr("href"),
        });
      });

    return recommendedAnime;
  });
}
