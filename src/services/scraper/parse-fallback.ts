import { CheerioAPI } from "cheerio";
import { cleanText } from "./sanitize";

export interface FallbackExtractResult {
  title?: string;
  image?: string;
  synopsis?: string;
}

export function extractWithFallback($: CheerioAPI): FallbackExtractResult {
  // Title fallback: .venser h1 -> article h1 -> main h1 -> title tag
  const title =
    cleanText($(".venser h1.jdl").text()) ||
    cleanText($("article h1").first().text()) ||
    cleanText($("h1").first().text()) ||
    cleanText(
      $("title")
        .text()
        .replace(/ - Kusonime.*/i, ""),
    );

  // Image fallback: .thumb img -> article img -> first non-icon img
  const image =
    $(".venser .thumb img").attr("src") || $("article img").first().attr("src") || $("main img").first().attr("src");

  // Synopsis fallback: .lexot p -> article p
  const synopsis = cleanText($(".venser .lexot > p").first().text()) || cleanText($("article p").first().text());

  return {
    title: title || undefined,
    image: image || undefined,
    synopsis: synopsis || undefined,
  };
}
