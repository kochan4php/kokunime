import { Anime } from "@/interfaces";
import { CheerioAPI } from "cheerio";
import { KUSONIME_URL } from "./constants";

export function formatAnimeData($: CheerioAPI): Anime[] {
  const anime: Anime[] = [];
  const element = $(".venutama");

  $(element)
    .find(".venz ul .kover")
    .each((_, el) => {
      const title = $(el).find(".content > h2 > a").text();
      const release = $(el).find(".content > p").text().trim().split("Genre")[0].trim().split("Admin")[1].trim();
      const genres = $(el).find(".content > p").text().trim().split("Genre")[1].replace(/^:\s*/, "").trim().split(", ");
      const link = {
        endpoint: $(el).find(".thumb a").attr("href")?.replace(KUSONIME_URL, ""),
        url: $(el).find(".thumb a").attr("href"),
        image: $(el).find(".thumb a .thumbz img").attr("src"),
      };

      anime.push({ title, release, genres, link });
    });

  return anime;
}
