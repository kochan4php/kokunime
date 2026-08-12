import { Anime } from "@/interfaces";
import { CheerioAPI } from "cheerio";
import { KUSONIME_URL } from "./constants";
import { bestImage } from "./parse-image";

export function formatAnimeData($: CheerioAPI): Anime[] {
  const anime: Anime[] = [];
  const element = $(".venutama");

  $(element)
    .find(".venz ul .kover")
    .each((_, el) => {
      const $content = $(el).find(".content");
      const title = $content.find("h2 > a").text();
      // Real markup: p1 = "Posted by Admin", p2 = "Released on 3:54 pm", p3 = "Genre <a>…"
      // Selectors by position so a missing/moved label can't crash the whole list.
      const release = $content
        .find("p")
        .eq(1)
        .text()
        .trim()
        .replace(/^Released on\s*/i, "");
      const genres = $content
        .find("p")
        .eq(2)
        .find("a")
        .map((_, anchor) => $(anchor).text())
        .get();
      const link = {
        endpoint: $(el).find(".thumb a").attr("href")?.replace(KUSONIME_URL, ""),
        url: $(el).find(".thumb a").attr("href"),
        image: bestImage($(el).find(".thumb a .thumbz img")),
      };

      anime.push({ title, release, genres, link });
    });

  return anime;
}
