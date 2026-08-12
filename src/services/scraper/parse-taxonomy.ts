import kusonime from "@/config/kusonime";
import { cached } from "@/services/cache";
import { load } from "cheerio";
import { KUSONIME_URL } from "./constants";

interface TaxonomyItem {
  name: string;
  url?: string;
  endpoint?: string;
}

const parseTaxonomy = async (path: string, key: string, ttlSeconds: number): Promise<TaxonomyItem[]> => {
  return cached(
    key,
    ttlSeconds,
    async () => {
      const response = await kusonime.get(path);
      const $ = load(response.data);
      const items: TaxonomyItem[] = [];
      const element = $(".venser > .venutama");

      $(element)
        .find("ul.genres > li")
        .each((_, el) => {
          items.push({
            name: $(el).find("a").text(),
            endpoint: $(el).find("a").attr("href")?.replace(KUSONIME_URL, ""),
            url: $(el).find("a").attr("href"),
          });
        });

      items.splice(0, 1);
      return items;
    },
    [],
  );
};

export default parseTaxonomy;
