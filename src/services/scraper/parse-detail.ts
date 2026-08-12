import { DownloadOption } from "@/interfaces";
import { CheerioAPI } from "cheerio";
import { getDownloadLinks } from "./parse-download";
import { parseGenres } from "./parse-genres";
import { parseSeason } from "./parse-season";
import { bestImage } from "./parse-image";

function parseDownloads($: CheerioAPI): DownloadOption[] {
  let download: DownloadOption[] = [];
  download = getDownloadLinks($, ".smokeddlrh", ".smokeurlrh", ".smokettlrh");

  if (download.length === 0) {
    download = getDownloadLinks($, ".smokeddlrhrh", ".smokeurlrhrh", ".smokettlrhrh");

    if (download.length === 0) {
      download = getDownloadLinks($, ".smokeddl", ".smokeurl", ".smokettl");
    }
  }

  return download.filter((element) => element.link_download.length > 0 && element.title !== "");
}

// Strips the "<b>Label</b>:" prefix. Never throws when a field or its label is
// missing, and keeps values that themselves contain colons.
const fieldValue = (text: string): string => {
  const colon = text.indexOf(":");
  return colon < 0 ? "" : text.slice(colon + 1).trim();
};

export function parseAnimeDetail($: CheerioAPI) {
  const element = $(".venser");
  const info = $(element).find(".lexot .info > p");

  return {
    title: $(element).find(".post-thumb img").attr("title"),
    japanese: fieldValue(info.eq(0).text()),
    image: bestImage($(element).find(".post-thumb img")),
    producer: fieldValue(info.eq(3).text()),
    type: fieldValue(info.eq(4).text()),
    status: fieldValue(info.eq(5).text()),
    total_episode: fieldValue(info.eq(6).text()),
    score: fieldValue(info.eq(7).text()),
    duration: fieldValue(info.eq(8).text()),
    release_on: fieldValue(info.eq(9).text()),
    // Join all synopsis paragraphs, dropping upstream's "Credit"/"Download" boilerplate.
    synopsis: $(element)
      .find(".lexot > p")
      .map((_, p) => $(p).text().trim())
      .get()
      .filter(Boolean)
      .filter((text) => !/^(Download|Credit)/i.test(text))
      .join(" "),
    genre: parseGenres($),
    season: parseSeason($),
    download: parseDownloads($),
  };
}
