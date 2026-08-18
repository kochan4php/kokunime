import { Genre } from "@/interfaces";
import { CheerioAPI } from "cheerio";
import { UPSTREAM_URL } from "./constants";
import { cleanText } from "./sanitize";

export function parseGenres($: CheerioAPI): Genre[] {
  const genres: Genre[] = [];

  $(".venser .info > p").each((_, p) => {
    const text = $(p).text();
    const colon = text.indexOf(":");
    const label = colon >= 0 ? text.slice(0, colon) : text;

    if (/genre/i.test(label)) {
      $(p)
        .find("a")
        .each((_, el) => {
          const name = cleanText($(el).text());
          const href = $(el).attr("href");
          if (name && href) {
            genres.push({
              name,
              url: href,
              endpoint: href.replace(UPSTREAM_URL, ""),
            });
          }
        });
    }
  });

  return genres;
}
