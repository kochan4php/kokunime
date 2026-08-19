import upstream from "@/config/upstream";
import { cached } from "@/services/cache";
import { load } from "cheerio";
import { UPSTREAM_URL } from "./constants";
import { stripHtmlNoise } from "./sanitize";

interface TaxonomyItem {
  name: string;
  url?: string;
  endpoint?: string;
}

const parseTaxonomy = async (path: string): Promise<TaxonomyItem[]> => {
  try {
    const response = await upstream.get(path);
    const $ = load(stripHtmlNoise(response.data));
    const items: TaxonomyItem[] = [];
    const element = $(".venser > .venutama");

    $(element)
      .find("ul.genres > li")
      .each((_, el) => {
        const $a = $(el).find("a");
        const name = $a.text().trim();
        const href = $a.attr("href");
        if (name && href && !/^(genres?|seasons?|musim)(\s+list)?$/i.test(name)) {
          items.push({
            name,
            endpoint: href.replace(UPSTREAM_URL, ""),
            url: href,
          });
        }
      });

    return items;
  } catch {
    return [];
  }
};

export default parseTaxonomy;
