import { DownloadOption } from "@/interfaces";
import { CheerioAPI } from "cheerio";
import { getDownloadLinks } from "./parse-download";
import { parseGenres } from "./parse-genres";
import { parseSeason } from "./parse-season";
import { bestImage } from "./parse-image";
import { cleanText } from "./sanitize";

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

const HAS_CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/;

export function parseAnimeDetail($: CheerioAPI) {
  const element = $(".venser");
  const meta: Record<string, string> = {};

  $(element)
    .find(".lexot .info > p")
    .each((_, p) => {
      const text = $(p).text().trim();
      const colon = text.indexOf(":");
      if (colon === -1) return;
      const label = text.slice(0, colon).toLowerCase().replace(/\s+/g, " ");
      const value = cleanText(text.slice(colon + 1).trim());

      if (/jepang|japanese|judul jepang/i.test(label)) {
        meta.japanese = value;
      } else if (/sinonim|synonym/i.test(label)) {
        if (!meta.japanese || (!HAS_CJK.test(meta.japanese) && HAS_CJK.test(value))) {
          meta.japanese = value;
        }
      } else if (/produser|producer|studio/i.test(label)) meta.producer = value;
      else if (/tipe|type/i.test(label)) meta.type = value;
      else if (/status/i.test(label)) meta.status = value;
      else if (/episode/i.test(label)) meta.total_episode = value;
      else if (/skor|score/i.test(label)) meta.score = value;
      else if (/durasi|duration/i.test(label)) meta.duration = value;
      else if (/rilis|release/i.test(label)) meta.release_on = value;
      else if (/rating|umur|age/i.test(label)) meta.rating = value;
      else if (/english|inggris/i.test(label)) meta.synonyms = value;
    });

  const rawTitle = $(element).find(".post-thumb img").attr("title") || $(element).find(".jdlrx h1").text().trim();
  const fullContent = `${rawTitle} ${$(element).find(".lexot").text()}`;
  let audio: string | undefined;
  if (/dual\s*audio/i.test(fullContent)) audio = "Dual Audio";
  else if (/jpn\s*audio|japanese\s*audio/i.test(fullContent)) audio = "Japanese Audio";
  else if (/eng\s*dub|english\s*dub/i.test(fullContent)) audio = "English Dub";

  let subtitle: string | undefined;
  if (/multi\s*sub/i.test(fullContent)) subtitle = "Multi Sub";
  else if (/sub\s*indo|subtitle\s*indonesia|indonesia\s*sub/i.test(fullContent)) subtitle = "Indo Sub";
  else if (/eng\s*sub|english\s*sub/i.test(fullContent)) subtitle = "Eng Sub";

  let trailer =
    $(element).find("iframe[src*='youtube']").attr("src") ||
    $(element).find("iframe[src*='youtu.be']").attr("src") ||
    $(element).find(".lexot iframe").attr("src");

  if (trailer && trailer.startsWith("//")) {
    trailer = `https:${trailer}`;
  }

  const aliasesSet = new Set<string>();
  if (meta.japanese) aliasesSet.add(meta.japanese);
  if (meta.synonyms) {
    meta.synonyms.split(/[,;/|]+/).forEach((s) => {
      const trimmed = cleanText(s.trim());
      if (trimmed) aliasesSet.add(trimmed);
    });
  }
  const aliases = Array.from(aliasesSet);

  return {
    title: cleanText(rawTitle),
    japanese: meta.japanese,
    image: bestImage($(element).find(".post-thumb img")),
    producer: meta.producer,
    type: meta.type,
    status: meta.status,
    total_episode: meta.total_episode,
    score: meta.score,
    duration: meta.duration,
    release_on: meta.release_on,
    rating: meta.rating,
    synonyms: meta.synonyms,
    aliases,
    audio,
    subtitle,
    synopsis: $(element)
      .find(".lexot > p")
      .map((_, p) => cleanText($(p).text().trim()))
      .get()
      .filter(Boolean)
      .filter((text) => !/^(Download|Credit)/i.test(text))
      .join(" "),
    genre: parseGenres($),
    season: parseSeason($),
    trailer,
    download: parseDownloads($),
  };
}
