import kusonime from "@/config/kusonime";
import { Recommendation } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { KUSONIME_URL } from "./constants";
import { bestImage } from "./parse-image";

export async function getRecommendations(): Promise<Recommendation[]> {
  return cached(
    "recommendations",
    TTL.recommendations,
    async () => {
      // The recommendation widget ("Rekomendasi Maz'e") is empty on the
      // homepage — page 2+ carries it.
      const response = await kusonime.get("/page/2/");
      const $ = load(response.data);
      const recommendedAnime: Recommendation[] = [];
      const element = $(".rekomf");

      $(element)
        .find(".recomx > ul > li")
        .each((_, el) => {
          recommendedAnime.push({
            title: $(el).find(".zeeb > a > img").attr("title"),
            endpoint: $(el).find(".zeeb > a").attr("href")?.replace(KUSONIME_URL, ""),
            image: bestImage($(el).find(".zeeb > a > img")),
            url: $(el).find(".zeeb > a").attr("href"),
          });
        });

      return recommendedAnime;
    },
    [],
  );
}
