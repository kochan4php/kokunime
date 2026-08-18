import { Anime } from "@/interfaces";
import { CheerioAPI } from "cheerio";
import { UPSTREAM_URL } from "./constants";
import { bestImage } from "./parse-image";
import { cleanText } from "./sanitize";

export function formatAnimeData($: CheerioAPI): Anime[] {
  const anime: Anime[] = [];
  const element = $(".venutama");

  $(element)
    .find(".venz ul .kover")
    .each((_, el) => {
      const $content = $(el).find(".content");
      const title = cleanText($content.find("h2 > a").text());
      const release = cleanText(
        $content
          .find("p")
          .eq(1)
          .text()
          .replace(/^Released on\s*/i, ""),
      );
      const genres = $content
        .find("p")
        .eq(2)
        .find("a")
        .map((_, anchor) => cleanText($(anchor).text()))
        .get();
      const link = {
        endpoint: $(el).find(".thumb a").attr("href")?.replace(UPSTREAM_URL, ""),
        url: $(el).find(".thumb a").attr("href"),
        image: bestImage($(el).find(".thumb a .thumbz img")),
      };

      anime.push({ title, release, genres, link });
    });

  return anime;
}
