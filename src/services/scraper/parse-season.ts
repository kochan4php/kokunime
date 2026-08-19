import { CheerioAPI } from "cheerio";
import { UPSTREAM_URL } from "./constants";
import { cleanText } from "./sanitize";

function normalizeSeasonName(raw: string): string {
  const clean = cleanText(raw);
  return clean
    .replace(/_/g, " ")
    .replace(
      /\b(winter|spring|summer|fall|autumn)\b/gi,
      (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase(),
    );
}

export function parseSeason($: CheerioAPI) {
  let seasonData: { name?: string; url?: string; endpoint?: string } | undefined;

  $(".venser .lexot .info > p").each((_, p) => {
    const text = $(p).text();
    const colon = text.indexOf(":");
    const label = colon >= 0 ? text.slice(0, colon) : text;

    if (/season|musim/i.test(label)) {
      const $a = $(p).find("a");
      const rawName = $a.length > 0 ? $a.text() : text.slice(colon + 1);
      const name = normalizeSeasonName(rawName);
      const href = $a.attr("href") || (name ? `/seasons/${name.toLowerCase().replace(/\s+/g, "-")}/` : undefined);

      if (name) {
        seasonData = {
          name,
          url: href,
          endpoint: href ? href.replace(UPSTREAM_URL, "").replace(/^\//, "") : undefined,
        };
      }
    }
  });

  return seasonData;
}
