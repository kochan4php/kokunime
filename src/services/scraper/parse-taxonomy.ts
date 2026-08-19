import upstream from "@/config/upstream";
import { cached, TTL } from "@/services/cache";
import { load } from "cheerio";
import { UPSTREAM_URL } from "./constants";
import { stripHtmlNoise } from "./sanitize";

interface TaxonomyItem {
  name: string;
  url?: string;
  endpoint?: string;
}

const parseTaxonomy = async (path: string): Promise<TaxonomyItem[]> => {
  return cached(
    `taxonomy:${path}`,
    TTL.genres,
    async () => {
      const response = await upstream.get(path);
      const $ = load(stripHtmlNoise(response.data));
      const items: TaxonomyItem[] = [];
      const listElements = $("ul.genres > li, .venser ul.genres > li, .venutama ul.genres > li");

      listElements.each((_, el) => {
        const $a = $(el).find("a");
        const name = $a.text().trim();
        const href = $a.attr("href") || "";
        if (name && href && !/^(genres?|seasons?|musim)(\s+list)?$/i.test(name)) {
          const cleanEndpoint = href
            .replace(UPSTREAM_URL, "")
            .replace(/^https?:\/\/[^/]+\//i, "")
            .replace(/^\/+/, "");

          items.push({
            name,
            endpoint: cleanEndpoint,
            url: href,
          });
        }
      });

      return items;
    },
    [],
  );
};

export default parseTaxonomy;
