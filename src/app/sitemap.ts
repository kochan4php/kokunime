import { getAnimePerPage } from "@/services/scraper";
import { SITE_URL } from "@/lib/site";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/genres`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/seasons`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

  try {
    const { anime = [] } = await getAnimePerPage(1);

    for (const item of anime) {
      const endpoint = item.link?.endpoint?.split("/").join(" ").trim();
      if (!endpoint) continue;
      entries.push({
        url: `${SITE_URL}/anime/${endpoint}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  } catch {
    // fallback: home only
  }

  return entries;
}
