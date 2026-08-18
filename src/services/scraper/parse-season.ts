import { CheerioAPI } from "cheerio";
import { UPSTREAM_URL } from "./constants";
import { cleanText } from "./sanitize";

export function parseSeason($: CheerioAPI) {
  let seasonData: { name?: string; url?: string; endpoint?: string } | undefined;

  $(".venser .lexot .info > p").each((_, p) => {
    const text = $(p).text();
    const colon = text.indexOf(":");
    const label = colon >= 0 ? text.slice(0, colon) : text;

    if (/season|musim/i.test(label)) {
      const $a = $(p).find("a");
      const name = cleanText($a.text());
      const href = $a.attr("href");
      if (name && href) {
        seasonData = {
          name,
          url: href,
          endpoint: href.replace(UPSTREAM_URL, ""),
        };
      }
    }
  });

  return seasonData;
}
