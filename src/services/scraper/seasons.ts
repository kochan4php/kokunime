import kusonime from "@/config/kusonime";
import { AnimePage, Season } from "@/interfaces";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { formatAnimeData } from "./parse";
import { parseSimplePagination } from "./parse-simple-pagination";
import { KUSONIME_URL } from "./constants";

export async function getSeasons(): Promise<Season[]> {
  return cached("seasons", TTL.seasons, async () => {
    const response = await kusonime.get("/seasons-list");
    const $ = load(response.data);
    const seasons: Season[] = [];
    const element = $(".venser > .venutama");

    $(element)
      .find("ul.genres > li")
      .each((_, el) => {
        seasons.push({
          name: $(el).find("a").text(),
          endpoint: $(el).find("a").attr("href")?.replace(KUSONIME_URL, ""),
          url: $(el).find("a").attr("href"),
        });
      });

    seasons.splice(0, 1);
    return seasons;
  });
}

export async function getAnimeBySeasons(season: string, page: number | string): Promise<AnimePage> {
  return cached(`anime-by-season:${season}:${page}`, TTL.bySeason, async () => {
    const response = await kusonime.get(`/seasons/${season}/page/${page}`);
    const $ = load(response.data);

    return { anime: formatAnimeData($), pagination: parseSimplePagination($, Number(page)) };
  });
}
