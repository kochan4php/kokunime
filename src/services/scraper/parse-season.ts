import { CheerioAPI } from "cheerio";
import { UPSTREAM_URL } from "./constants";

export function parseSeason($: CheerioAPI) {
  const element = $(".venser .lexot .info > p:nth-of-type(3) > a");

  return {
    name: element.text(),
    url: element.attr("href"),
    endpoint: element.attr("href")?.replace(UPSTREAM_URL, ""),
  };
}
