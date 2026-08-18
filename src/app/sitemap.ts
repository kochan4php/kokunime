import { getAnimePerPage, getGenres, getSeasons } from "@/services/scraper";
import { SITE_URL } from "@/lib/site";
import { animeSlug, endpointSlug } from "@/utils/endpoint-slug";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/genres`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/seasons`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  try {
    const { anime = [], pagination } = await getAnimePerPage(1);

    for (const item of anime) {
      const endpoint = animeSlug(item.link?.endpoint);
      if (!endpoint) continue;
      entries.push({
        url: `${SITE_URL}/anime/${endpoint}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }

    const totalPages = pagination?.total_page ?? 1;
    for (let page = 2; page <= totalPages; page++) {
      entries.push({
        url: `${SITE_URL}/page/${page}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.5,
      });
    }

    // Include detail pages beyond page 1 (bounded crawl; cached by unstable_cache).
    const depthResults = await Promise.allSettled(
      Array.from({ length: Math.max(0, Math.min(10, totalPages) - 1) }, (_, i) => getAnimePerPage(i + 2)),
    );
    for (const res of depthResults) {
      if (res.status === "fulfilled") {
        for (const item of res.value.anime ?? []) {
          const endpoint = animeSlug(item.link?.endpoint);
          if (!endpoint) continue;
          entries.push({
            url: `${SITE_URL}/anime/${endpoint}`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.7,
          });
        }
      }
    }

    const [genresRes, seasonsRes] = await Promise.allSettled([getGenres(), getSeasons()]);

    if (genresRes.status === "fulfilled") {
      for (const genre of genresRes.value) {
        const slug = endpointSlug(genre.endpoint, "genres");
        if (!slug) continue;
        entries.push({ url: `${SITE_URL}/genres/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.4 });
      }
    }

    if (seasonsRes.status === "fulfilled") {
      for (const season of seasonsRes.value) {
        const slug = endpointSlug(season.endpoint, "seasons");
        if (!slug) continue;
        entries.push({ url: `${SITE_URL}/seasons/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.4 });
      }
    }
  } catch {
    // fallback: home + pagination only
  }

  return entries;
}
