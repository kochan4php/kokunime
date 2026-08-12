import { Genre } from "@/interfaces";
import { CheerioAPI } from "cheerio";
import { UPSTREAM_URL } from "./constants";

export function parseGenres($: CheerioAPI): Genre[] {
  const genres: Genre[] = [];

  $(".venser .info > p:nth-of-type(2) > a").each((_, el) => {
    genres.push({
      name: $(el).text(),
      url: $(el).attr("href"),
      endpoint: $(el)?.attr("href")?.replace(UPSTREAM_URL, ""),
    });
  });

  return genres;
}
