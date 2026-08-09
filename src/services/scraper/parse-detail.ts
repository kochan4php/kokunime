import { CheerioAPI } from "cheerio";
import { getDownloadLinks } from "./parse-download";
import { parseGenres } from "./parse-genres";
import { parseSeason } from "./parse-season";

function parseDownloads($: CheerioAPI) {
  let download = [];
  download = getDownloadLinks($, ".smokeddlrh", ".smokeurlrh", ".smokettlrh");

  if (download.length === 0) {
    download = getDownloadLinks($, ".smokeddlrhrh", ".smokeurlrhrh", ".smokettlrhrh");

    if (download.length === 0) {
      download = getDownloadLinks($, ".smokeddl", ".smokeurl", ".smokettl");
    }
  }

  return download.filter((element) => element.link_download.length > 0 && element.title !== "");
}

export function parseAnimeDetail($: CheerioAPI) {
  const element = $(".venser");

  return {
    title: $(element).find(".post-thumb img").attr("title"),
    japanese: $(element).find(".lexot .info > p:nth-of-type(1)").text().split(":")[1].trim(),
    image: $(element).find(".post-thumb img").attr("src"),
    producer: $(element).find(".lexot .info > p:nth-of-type(4)").text().split(":")[1].trim(),
    type: $(element).find(".lexot .info > p:nth-of-type(5)").text().split(":")[1].trim(),
    status: $(element).find(".lexot .info > p:nth-of-type(6)").text().split(":")[1].trim(),
    total_episode: $(element).find(".lexot .info > p:nth-of-type(7)").text().split(":")[1].trim(),
    score: $(element).find(".lexot .info > p:nth-of-type(8)").text().split(":")[1].trim(),
    duration: $(element).find(".lexot .info > p:nth-of-type(9)").text().split(":")[1].trim(),
    release_on: $(element).find(".lexot .info > p:nth-of-type(10)").text().split(":")[1].trim(),
    synopsis: $(element).find(".lexot > p:nth-of-type(1)").text().trim(),
    genre: parseGenres($),
    season: parseSeason($),
    download: parseDownloads($),
  };
}
