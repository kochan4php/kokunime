import cheerio, { CheerioAPI } from "cheerio";
import kusonime from "@/config/kusonime";
import {
  AnimeType,
  DownloadLinkType,
  DownloadType,
  GenreType,
  GetAnimePerPageType,
  PlatformType,
  RekomendasiType,
  SeasonType,
} from "@/interfaces";
import logger from "@/utils/logger";

const KUSONIME_URL = "https://kusonime.com/";

export default class MainController {
  public static getDownloadLinks(
    $: CheerioAPI,
    wrapperClass: string,
    urlClass: string,
    titleClass: string,
  ): DownloadType[] {
    const download: DownloadType[] = [];
    const element = $(".venser");

    $(element)
      .find(wrapperClass)
      .each((_, element) => {
        const temp_res: DownloadLinkType[] = [];

        $(element)
          .find(urlClass)
          .each((_, el) => {
            const temp_dl: PlatformType[] = [];

            $(el)
              .find("a")
              .each((_, elm) => {
                const obj = { platform: $(elm).text(), url: $(elm).attr("href") };
                temp_dl.push(obj);
              });

            const obj = { resolusi: $(el).find("strong").text(), link: temp_dl };
            temp_res.push(obj);
          });

        const obj = { title: $(element).find(titleClass).text(), link_download: temp_res };
        download.push(obj);
      });

    return download;
  }

  public static formatAnimeData($: CheerioAPI): AnimeType[] {
    const anime: AnimeType[] = [];
    const element = $(".venutama");

    $(element)
      .find(".venz ul .kover")
      .each((_, el) => {
        const title = $(el).find(".content > h2 > a").text();
        const release = $(el).find(".content > p").text().trim().split("Genre")[0].trim().split("Admin")[1].trim();
        const genres = $(el).find(".content > p").text().trim().split("Genre")[1].trim().split(", ");
        const link = {
          endpoint: $(el).find(".thumb a").attr("href")?.replace(KUSONIME_URL, ""),
          url: $(el).find(".thumb a").attr("href"),
          image: $(el).find(".thumb a .thumbz img").attr("src"),
        };

        anime.push({ title, release, genres, link });
      });

    return anime;
  }

  public static async getAnimePerPage(page: number): Promise<GetAnimePerPageType> {
    try {
      const response = await kusonime.get(`/page/${page}`);
      const $ = cheerio.load(response.data);
      const anime = MainController.formatAnimeData($);

      const element = $(".venutama");
      const current_page = Number($(element).find(".pagination .wp-pagenavi .current").text());
      const total_page = Number($(element).find(".pagination .wp-pagenavi .pages").text().split("of")[1].trim());

      const pagination = {
        first_page_endpoint: "page/1",
        next_page_endpoint: current_page === total_page ? null : `page/${current_page + 1}`,
        current_page,
        pages_of: $(element).find(".pagination .wp-pagenavi .pages").text(),
        total_page,
        prev_page_endpoint: current_page > 1 ? `page/${current_page - 1}` : null,
        last_page_endpoint: `page/${total_page}`,
      };

      return { anime, pagination } as GetAnimePerPageType;
    } catch (err: any) {
      logger.log("Error", err.message, err.stack);
      return {} as GetAnimePerPageType;
    }
  }

  public static async getAnimeDetail(slug: string) {
    try {
      const response = await kusonime.get(`/${slug}`);
      const $ = cheerio.load(response.data);
      const element = $(".venser");

      const genre: GenreType[] = [];
      $(element)
        .find(".info > p:nth-of-type(2) > a")
        .each((_, el) => {
          const obj = {
            name: $(el).text(),
            url: $(el).attr("href"),
            endpoint: $(el)?.attr("href")?.replace(KUSONIME_URL, ""),
          };

          genre.push(obj);
        });

      let download = [];
      download = MainController.getDownloadLinks($, ".smokeddlrh", ".smokeurlrh", ".smokettlrh");

      if (download.length === 0) {
        download = MainController.getDownloadLinks($, ".smokeddlrhrh", ".smokeurlrhrh", ".smokettlrhrh");

        if (download.length === 0) {
          download = MainController.getDownloadLinks($, ".smokeddl", ".smokeurl", ".smokettl");
        }
      }

      download = download.filter((element) => element.link_download.length > 0 && element.title !== "");

      const season = {
        name: $(element).find(".lexot .info > p:nth-of-type(3) > a").text(),
        url: $(element).find(".lexot .info > p:nth-of-type(3) > a").attr("href"),
        endpoint: $(element).find(".lexot .info > p:nth-of-type(3) > a").attr("href")?.replace(KUSONIME_URL, ""),
      };

      const animeDetail = {
        title: $(element).find(".post-thumb img").attr("title"),
        japanese: $(element).find(".lexot .info > p:nth-of-type(1)").text().split(":")[1].trim(),
        image: $(element).find(".post-thumb img").attr("src"),
        producer: $(element).find(".lexot .info > p:nth-of-type(4)").text().split(":")[1].trim(),
        type: $(element).find(".lexot .info > p:nth-of-type(5)").text().split(":")[1].trim(),
        status: $(element).find(".lexot .info > p:nth-of-type(6)").text().split(":")[1].trim(),
        total_episode: $(element).find(".lexot .info > p:nth-of-type(7)").text().split(":")[1].trim(),
        score: `⭐ ${$(element).find(".lexot .info > p:nth-of-type(8)").text().split(":")[1].trim()}`,
        duration: $(element).find(".lexot .info > p:nth-of-type(9)").text().split(":")[1].trim(),
        release_on: $(element).find(".lexot .info > p:nth-of-type(10)").text().split(":")[1].trim(),
        synopsis: $(element).find(".lexot > p:nth-of-type(1)").text().trim(),
        genre,
        season,
        download,
      };

      return animeDetail;
    } catch (err: any) {
      logger.log("Error", err.message, err.stack);
      return {};
    }
  }

  public static async getRekomendasi(): Promise<RekomendasiType[]> {
    try {
      const response = await kusonime.get("/");
      const $ = cheerio.load(response.data);
      const rekomendAnime: RekomendasiType[] = [];
      const element = $(".rekomf");

      $(element)
        .find(".recomx > ul > li")
        .each((_, el) => {
          const obj = {
            title: $(el).find(".zeeb > a > img").attr("title"),
            endpoint: $(el).find(".zeeb > a").attr("href")?.replace(KUSONIME_URL, ""),
            image: $(el).find(".zeeb > a > img").attr("src"),
            url: $(el).find(".zeeb > a").attr("href"),
          };

          rekomendAnime.push(obj);
        });

      return rekomendAnime;
    } catch (err: any) {
      logger.log("Error", err.message, err.stack);
      return [] as RekomendasiType[];
    }
  }

  public static async getGenres() {
    try {
      const response = await kusonime.get("/genres");
      const $ = cheerio.load(response.data);
      const genres: GenreType[] = [];
      const element = $(".venser > .venutama");

      $(element)
        .find("ul.genres > li")
        .each((_, el) => {
          const obj = {
            name: $(el).find("a").text(),
            endpoint: $(el).find("a").attr("href")?.replace(KUSONIME_URL, ""),
            url: $(el).find("a").attr("href"),
          };

          genres.push(obj);
        });

      genres.splice(0, 1);
      return genres;
    } catch (err: any) {
      logger.log("Error", err.message, err.stack);
      return null;
    }
  }

  public static async getAnimeByGenres(genre: string, page: number | string) {
    try {
      const response = await kusonime.get(`/genres/${genre}/page/${page}`);
      const $ = cheerio.load(response.data);
      const anime = MainController.formatAnimeData($);

      return anime;
    } catch (err: any) {
      logger.log("Error", err.message, err.stack);
      return null;
    }
  }

  public static async getSeasons() {
    try {
      const response = await kusonime.get("/seasons-list");
      const $ = cheerio.load(response.data);
      const seasons: SeasonType[] = [];
      const element = $(".venser > .venutama");

      $(element)
        .find("ul.genres > li")
        .each((_, el) => {
          const obj = {
            name: $(el).find("a").text(),
            endpoint: $(el).find("a").attr("href")?.replace(KUSONIME_URL, ""),
            url: $(el).find("a").attr("href"),
          };

          seasons.push(obj);
        });

      seasons.splice(0, 1);
      return seasons;
    } catch (err: any) {
      logger.log("Error", err.message, err.stack);
      return null;
    }
  }

  public static async getAnimeBySeasons(season: string, page: string | number) {
    try {
      const response = await kusonime.get(`/seasons/${season}/page/${page}`);
      const $ = cheerio.load(response.data);
      const anime = MainController.formatAnimeData($);

      return anime;
    } catch (err: any) {
      logger.log("Error", err.message, err.stack);
      return null;
    }
  }

  public static async searchAnime(query: string) {
    try {
      const response = await kusonime.get(`/?s=${query}&post_type=post`);
      const $ = cheerio.load(response.data);
      const anime = MainController.formatAnimeData($);

      return anime;
    } catch (err: any) {
      logger.log("Error", err.message, err.stack);
      return {} as AnimeType[];
    }
  }
}
