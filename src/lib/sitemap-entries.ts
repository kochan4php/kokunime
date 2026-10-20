import { getAnimePerPage, getGenres, getSeasons } from "@/services/scraper";
import { getLastUpstreamFetchAt } from "@/services/cache";
import { getCatalogSnapshot } from "@/lib/catalog-snapshot";
import { letterOf, letterSlug } from "@/lib/catalog-index";
import { SITE_URL } from "@/lib/site";
import { animeSlug, endpointSlug } from "@/utils/endpoint-slug";
import type { MetadataRoute } from "next";

// Chunk size stays well under the 50k protocol cap so every file remains small
// enough for crawlers to fetch quickly.
export const SITEMAP_CHUNK_SIZE = 5000;

type SitemapEntry = MetadataRoute.Sitemap[number];

const validDate = (value: string, fallback: Date): Date => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : fallback;
};

// Deterministic builder shared by the index route (/sitemap.xml) and the chunk
// routes (/sitemaps/[id].xml): chunk N always contains the same slice while
// the upstream catalog is stable, because ordering only depends on the crawl.
export const getSitemapEntries = async (): Promise<SitemapEntry[]> => {
  const now = new Date(getLastUpstreamFetchAt() || Date.now());
  const entries = new Map<string, SitemapEntry>();
  const add = (entry: SitemapEntry): void => {
    const existing = entries.get(entry.url);
    if (!existing) {
      entries.set(entry.url, entry);
      return;
    }
    // Keep the snapshot's real lastmod but let the fresher listing image win.
    if (entry.images) existing.images = entry.images;
  };

  for (const entry of [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/update`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/indeks`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/genres`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/seasons`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/bookmarks`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/api`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/stats`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/roulette`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/wrapped`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/aksesibilitas`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ] satisfies SitemapEntry[]) {
    add(entry);
  }

  const snapshot = await getCatalogSnapshot();
  const catalogDate = new Date(snapshot?.fetchedAt || getLastUpstreamFetchAt() || Date.now());
  const letterCounts = new Map<string, number>();

  if (snapshot) {
    for (const item of snapshot.items) {
      const letter = letterOf(item.title);
      letterCounts.set(letter, (letterCounts.get(letter) ?? 0) + 1);
      add({
        url: `${SITE_URL}/anime/${item.slug}`,
        lastModified: validDate(item.modified, catalogDate),
        changeFrequency: "daily",
        priority: 0.7,
        ...(item.image ? { images: [item.image] } : {}),
      });
    }
    for (const [letter, count] of letterCounts) {
      // The letter page is noindexed below three titles; keep it out of the
      // sitemap so every submitted URL is indexable.
      if (count < 3) continue;
      add({
        url: `${SITE_URL}/indeks/${letterSlug(letter)}`,
        lastModified: catalogDate,
        changeFrequency: "weekly",
        priority: 0.4,
      });
    }
  }

  try {
    const { anime = [], pagination } = await getAnimePerPage(1);
    // Keep page 1 even with a full snapshot: it refreshes images and covers a
    // race where the snapshot lags the newest post by a few minutes.
    for (const item of anime) {
      const endpoint = animeSlug(item.link?.endpoint);
      if (!endpoint) continue;
      add({
        url: `${SITE_URL}/anime/${endpoint}`,
        lastModified: catalogDate,
        changeFrequency: "daily",
        priority: 0.7,
        ...(item.link?.image ? { images: [item.link.image] } : {}),
      });
    }

    const totalPages = pagination?.total_page ?? 1;
    for (let page = 2; page <= totalPages; page++) {
      add({
        url: `${SITE_URL}/page/${page}`,
        lastModified: catalogDate,
        changeFrequency: "daily",
        priority: 0.5,
      });
    }

    // Bounded depth only when the full snapshot is unavailable; otherwise the
    // snapshot already covers every post.
    if (!snapshot) {
      const depthResults = await Promise.allSettled(
        Array.from({ length: Math.max(0, Math.min(10, totalPages) - 1) }, (_, index) => getAnimePerPage(index + 2)),
      );
      for (const result of depthResults) {
        if (result.status !== "fulfilled") continue;
        for (const item of result.value.anime ?? []) {
          const endpoint = animeSlug(item.link?.endpoint);
          if (!endpoint) continue;
          add({
            url: `${SITE_URL}/anime/${endpoint}`,
            lastModified: catalogDate,
            changeFrequency: "daily",
            priority: 0.7,
            ...(item.link?.image ? { images: [item.link.image] } : {}),
          });
        }
      }
    }
  } catch {
    // The snapshot (when present) still provides the complete detail set.
  }

  const [genresRes, seasonsRes] = await Promise.allSettled([getGenres(), getSeasons()]);

  if (genresRes.status === "fulfilled") {
    for (const genre of genresRes.value) {
      const slug = endpointSlug(genre.endpoint, "genres");
      if (!slug) continue;
      add({
        url: `${SITE_URL}/genres/${slug}`,
        lastModified: catalogDate,
        changeFrequency: "weekly",
        priority: 0.4,
      });
    }
  }

  if (seasonsRes.status === "fulfilled") {
    const years = new Set<string>();
    for (const season of seasonsRes.value) {
      const slug = endpointSlug(season.endpoint, "seasons");
      if (!slug) continue;
      add({
        url: `${SITE_URL}/seasons/${slug}`,
        lastModified: catalogDate,
        changeFrequency: "weekly",
        priority: 0.4,
      });
      const year = slug.match(/-(19|20)\d{2}$/)?.[0]?.slice(1);
      if (year) years.add(year);
    }
    for (const year of years) {
      add({
        url: `${SITE_URL}/years/${year}`,
        lastModified: catalogDate,
        changeFrequency: "weekly",
        priority: 0.4,
      });
    }
  }

  return [...entries.values()];
};
