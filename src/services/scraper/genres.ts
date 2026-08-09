import kusonime from "@/config/kusonime";
import { AnimePage, Genre } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parseSimplePagination } from "./parse-simple-pagination";
import { KUSONIME_URL } from "./constants";

export async function getGenres(): Promise<Genre[]> {
  return cached("genres", TTL.genres, async () => {
    const response = await kusonime.get("/genres");
    const $ = load(response.data);
    const genres: Genre[] = [];
    const element = $(".venser > .venutama");

    $(element)
      .find("ul.genres > li")
      .each((_, el) => {
        genres.push({
          name: $(el).find("a").text(),
          endpoint: $(el).find("a").attr("href")?.replace(KUSONIME_URL, ""),
          url: $(el).find("a").attr("href"),
        });
      });

    genres.splice(0, 1);
    return genres;
  });
}

export async function getAnimeByGenres(genre: string, page: number | string): Promise<AnimePage> {
  return cached(`anime-by-genre:${genre}:${page}`, TTL.byGenre, async () => {
    const response = await kusonime.get(`/genres/${genre}/page/${page}`);
    const $ = load(response.data);

    return { anime: formatAnimeData($), pagination: parseSimplePagination($, Number(page)) };
  });
}
