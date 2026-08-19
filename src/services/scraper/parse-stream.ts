import { load, CheerioAPI } from "cheerio";
import { stripHtmlNoise } from "./sanitize";

export function parseHtmlStream(chunks: string[] | Buffer[]): CheerioAPI {
  let combined = "";
  for (const chunk of chunks) {
    combined += typeof chunk === "string" ? chunk : chunk.toString("utf8");
  }
  const cleanHtml = stripHtmlNoise(combined);
  return load(cleanHtml);
}
