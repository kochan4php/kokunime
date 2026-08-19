import { Anime } from "@/interfaces";
import { CheerioAPI } from "cheerio";
import { UPSTREAM_URL } from "./constants";
import { bestImage } from "./parse-image";
import { cleanText } from "./sanitize";

export function formatAnimeData($: CheerioAPI): Anime[] {
  const anime: Anime[] = [];
  const $kovers = $(".venutama .venz ul .kover, .venz ul .kover, .kover");

  $kovers.each((_, el) => {
    const $content = $(el).find(".content");
    const title = cleanText($content.find("h2 > a").text() || $content.find("h2").text());
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
    const rawHref = $(el).find(".thumb a").attr("href") || $content.find("h2 > a").attr("href");
    const endpoint = rawHref
      ? rawHref
          .replace(UPSTREAM_URL, "")
          .replace(/^https?:\/\/[^/]+\//i, "")
          .replace(/^\/+/, "")
      : undefined;
    const link = {
      endpoint,
      url: rawHref,
      image: bestImage($(el).find(".thumb a .thumbz img, .thumb img, img")),
    };

    if (title) {
      anime.push({ title, release, genres, link });
    }
  });

  return anime;
}
