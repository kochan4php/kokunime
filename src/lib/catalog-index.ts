import { getCatalogSnapshot } from "@/lib/catalog-snapshot";
import { getAnimePerPage } from "@/services/scraper";
import { animeSlug } from "@/utils/endpoint-slug";

interface IndexItem {
  title: string;
  slug: string;
}

interface CatalogIndexData {
  items: IndexItem[];
  complete: boolean;
  fetchedAt: number;
}

export const INDEX_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const INDEX_PAGE_SIZE = 200;
const FALLBACK_PAGES = 12;

export const letterOf = (title: string): string => {
  const first = title.trim().charAt(0).toUpperCase();
  return INDEX_LETTERS.includes(first) ? first : "#";
};

export const letterSlug = (letter: string): string => (letter === "#" ? "lain" : letter);

export const letterFromSlug = (value: string): string | null => {
  const clean = value.trim().toUpperCase();
  if (clean === "LAIN") return "#";
  return INDEX_LETTERS.includes(clean) ? clean : null;
};

interface IndexPagePosition {
  page: number;
  invalid: boolean;
}

// Clamp out-of-range pages to the last real page instead of rendering a soft
// 404 shell; metadata marks the requested URL noindex in the same pass.
export const resolveIndexPage = (value: string | string[] | undefined, totalPages: number): IndexPagePosition => {
  const raw = Array.isArray(value) ? value[0] : value;
  const provided = raw !== undefined && raw !== "";
  const parsed = Number(raw);
  const requested = provided && Number.isInteger(parsed) && parsed >= 1 ? parsed : null;
  const total = Math.max(1, totalPages);
  const page = requested ? Math.min(requested, total) : 1;
  return { page, invalid: provided && requested !== page };
};

const fallbackItems = async (): Promise<IndexItem[]> => {
  const results = await Promise.allSettled(
    Array.from({ length: FALLBACK_PAGES }, (_, index) => getAnimePerPage(index + 1)),
  );
  const seen = new Set<string>();
  const items: IndexItem[] = [];
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value.anime ?? []) {
      const slug = animeSlug(item.link?.endpoint) || animeSlug(item.link?.url);
      if (!slug || seen.has(slug) || !item.title) continue;
      seen.add(slug);
      items.push({ title: item.title, slug });
    }
  }
  return items;
};

// Discovery pages read the full snapshot when it is warm. The bounded listing
// fallback keeps the route useful while upstream is unavailable, and the
// `complete` flag makes that limitation visible instead of hiding it.
export const getCatalogIndex = async (): Promise<CatalogIndexData> => {
  const snapshot = await getCatalogSnapshot();
  if (snapshot) {
    return {
      items: snapshot.items.map(({ title, slug }) => ({ title, slug })),
      complete: snapshot.complete,
      fetchedAt: snapshot.fetchedAt,
    };
  }
  return { items: await fallbackItems(), complete: false, fetchedAt: 0 };
};
