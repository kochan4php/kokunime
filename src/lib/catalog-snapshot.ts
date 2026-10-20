import upstream from "@/config/upstream";
import { redisGet, redisSet } from "@/lib/redis";
import { cleanText } from "@/services/scraper/sanitize";
import { animeSlug, isSafeSlug } from "@/utils/endpoint-slug";

// Full catalog snapshot: the WordPress REST index gives every post slug/title
// and its real modified time in ~52 bounded requests. The listing pages remain
// the source for page-specific data; this snapshot only feeds discovery
// surfaces (A–Z and sitemap) so those never lie about their coverage.
interface CatalogItem {
  slug: string;
  title: string;
  modified: string;
  image?: string | undefined;
}

interface CatalogSnapshot {
  items: CatalogItem[];
  fetchedAt: number;
  complete: boolean;
}

const SNAPSHOT_KEY = "catalog:snapshot:v1";
const SNAPSHOT_TTL_SECONDS = 6 * 60 * 60;
const PARTIAL_TTL_SECONDS = 5 * 60;
const RETRY_BACKOFF_MS = 5 * 60 * 1000;
const MAX_PAGES = 200;
const CONCURRENCY = 6;
const POSTS_PATH = "/wp-json/wp/v2/posts?per_page=100&_fields=slug,title,modified,modified_gmt,featured_media";

interface WpPost {
  slug?: unknown;
  title?: { rendered?: unknown } | undefined;
  modified?: unknown;
  modified_gmt?: unknown;
}

// WordPress keeps non-ASCII slugs percent-encoded and allows underscores.
// Only accept percent bytes >= 0x80 so encoded separators (`%2f`) stay rejected.
const isCatalogSlug = (value: string): boolean =>
  isSafeSlug(value) ||
  (/^[a-z0-9][a-z0-9_-]*(?:%[0-9a-f]{2}[a-z0-9_-]*)+$/i.test(value) &&
    [...value.matchAll(/%([0-9a-f]{2})/gi)].every((match) => Number.parseInt(match[1] ?? "", 16) >= 0x80));

const isFresh = (snapshot: CatalogSnapshot): boolean => {
  const ttl = snapshot.complete ? SNAPSHOT_TTL_SECONDS * 1000 : PARTIAL_TTL_SECONDS * 1000;
  return Date.now() - snapshot.fetchedAt < ttl;
};

const isCatalogItem = (value: unknown): value is CatalogItem => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.slug === "string" &&
    isCatalogSlug(item.slug) &&
    typeof item.title === "string" &&
    item.title.length > 0 &&
    item.title.length <= 300 &&
    typeof item.modified === "string" &&
    (item.image === undefined || (typeof item.image === "string" && /^https?:\/\//i.test(item.image)))
  );
};

const parseSnapshot = (value: unknown): CatalogSnapshot | null => {
  if (!value || typeof value !== "object") return null;
  const snapshot = value as Record<string, unknown>;
  if (
    !Array.isArray(snapshot.items) ||
    typeof snapshot.fetchedAt !== "number" ||
    !Number.isFinite(snapshot.fetchedAt) ||
    typeof snapshot.complete !== "boolean" ||
    !snapshot.items.every(isCatalogItem)
  ) {
    return null;
  }
  return {
    items: snapshot.items,
    fetchedAt: snapshot.fetchedAt,
    complete: snapshot.complete,
  };
};

export const parseCatalogPosts = (posts: unknown, images: Map<string, string> = new Map()): CatalogItem[] => {
  if (!Array.isArray(posts)) return [];
  const seen = new Set<string>();
  const items: CatalogItem[] = [];
  for (const raw of posts) {
    if (!raw || typeof raw !== "object") continue;
    const post = raw as WpPost;
    const slug = typeof post.slug === "string" ? post.slug.trim().toLowerCase() : "";
    const title = typeof post.title?.rendered === "string" ? cleanText(post.title.rendered) : "";
    if (!slug || !isCatalogSlug(slug) || !title || seen.has(slug)) continue;
    const gmt = typeof post.modified_gmt === "string" ? post.modified_gmt : "";
    const modifiedValue =
      gmt && /(?:Z|[+-]\d\d:\d\d)$/.test(gmt)
        ? gmt
        : gmt
          ? `${gmt}Z`
          : typeof post.modified === "string"
            ? post.modified
            : "";
    const modifiedRaw = modifiedValue ? new Date(modifiedValue) : null;
    const modified = modifiedRaw && !Number.isNaN(modifiedRaw.getTime()) ? modifiedRaw.toISOString() : "";
    const image = images.get(slug);
    seen.add(slug);
    items.push({
      slug,
      title,
      modified,
      ...(image && /^https?:\/\//i.test(image) ? { image } : {}),
    });
  }
  return items;
};

// The post sitemap carries the featured image for each URL; the REST index
// intentionally stays small, so merge both without fetching every detail page.
export const parsePostSitemapImages = (xml: string, images: Map<string, string> = new Map()): Map<string, string> => {
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
    const body = block[1] ?? "";
    const loc = body.match(/<loc>\s*([^<]+?)\s*<\/loc>/i)?.[1];
    const image = body.match(/<image:loc>\s*([^<]+?)\s*<\/image:loc>/i)?.[1];
    if (!loc || !image) continue;
    const slug = animeSlug(loc.replaceAll("&amp;", "&"));
    const imageUrl = image.replaceAll("&amp;", "&");
    if (slug && isCatalogSlug(slug) && /^https?:\/\//i.test(imageUrl)) images.set(slug.toLowerCase(), imageUrl);
  }
  return images;
};

const loadImages = async (): Promise<Map<string, string>> => {
  const images = new Map<string, string>();
  try {
    const index = await upstream.get("/post-sitemap.xml", { timeoutMs: 20_000, expectBrand: false });
    const chunks = [...index.data.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
      .map((match) => match[1]?.replaceAll("&amp;", "&") ?? "")
      .filter((url) => /\/post-sitemap\d*\.xml$/i.test(url))
      .slice(0, 10);
    await Promise.allSettled(
      chunks.map(async (chunk) => {
        const sitemap = await upstream.get(chunk, { timeoutMs: 20_000, expectBrand: false });
        parsePostSitemapImages(sitemap.data, images);
      }),
    );
  } catch {
    // Images are an enhancement: a failed sitemap must not discard the catalog.
  }
  return images;
};

const loadPostsPage = async (page: number): Promise<{ posts: WpPost[]; headers: Record<string, string> }> => {
  const result = await upstream.getJson<WpPost[]>(`${POSTS_PATH}&page=${page}`, { timeoutMs: 20_000 });
  return { posts: Array.isArray(result.data) ? result.data : [], headers: result.headers };
};

const buildSnapshot = async (): Promise<CatalogSnapshot | null> => {
  const first = await loadPostsPage(1);
  const headerTotal = Number(first.headers["x-wp-totalpages"] ?? 0);
  const headerPosts = Number(first.headers["x-wp-total"] ?? 0);
  const hasTotal = Number.isFinite(headerTotal) && headerTotal > 0;
  const totalPages = hasTotal ? Math.min(headerTotal, MAX_PAGES) : 1;
  const imagesPromise = loadImages();
  let failedPages = 0;
  const pageNumbers = Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => index + 2);
  const rest: WpPost[] = [];

  for (let start = 0; start < pageNumbers.length; start += CONCURRENCY) {
    const batch = pageNumbers.slice(start, start + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (page) => {
        try {
          return (await loadPostsPage(page)).posts;
        } catch {
          failedPages++;
          return [];
        }
      }),
    );
    for (const posts of results) rest.push(...posts);
  }

  const images = await imagesPromise;
  const items = parseCatalogPosts([...first.posts, ...rest], images);
  if (items.length === 0) return null;

  return {
    items,
    fetchedAt: Date.now(),
    complete:
      failedPages === 0 &&
      hasTotal &&
      headerTotal <= MAX_PAGES &&
      (!Number.isFinite(headerPosts) || headerPosts <= 0 || items.length >= headerPosts),
  };
};

interface CatalogState {
  snapshot: CatalogSnapshot | null;
  inFlight: Promise<CatalogSnapshot | null> | null;
  retryAt: number;
}

// Route handlers are bundled separately; a plain module variable would rebuild
// the snapshot in every route. A global keeps one copy per server process.
const globalCatalog = globalThis as typeof globalThis & { __kokunimeCatalogState?: CatalogState };
const state = (globalCatalog.__kokunimeCatalogState ??= { snapshot: null, inFlight: null, retryAt: 0 });

const readShared = async (): Promise<CatalogSnapshot | null> => {
  try {
    return parseSnapshot(await redisGet(SNAPSHOT_KEY));
  } catch {
    return null;
  }
};

export const getCatalogSnapshot = async (): Promise<CatalogSnapshot | null> => {
  if (state.snapshot && isFresh(state.snapshot)) return state.snapshot;
  if (Date.now() < state.retryAt) return state.snapshot;

  const shared = await readShared();
  if (shared) state.snapshot = shared;
  if (shared && isFresh(shared)) return shared;

  if (!state.inFlight) state.inFlight = buildSnapshot();
  const flight = state.inFlight;
  try {
    const built = await flight;
    if (built) {
      state.snapshot = built;
      state.retryAt = 0;
      await redisSet(SNAPSHOT_KEY, built, built.complete ? SNAPSHOT_TTL_SECONDS : PARTIAL_TTL_SECONDS);
      return built;
    }
  } catch {
    // Fall through to the last good snapshot; the next request retries after
    // the backoff instead of hammering a challenged upstream.
  } finally {
    if (state.inFlight === flight) state.inFlight = null;
  }

  state.retryAt = Date.now() + RETRY_BACKOFF_MS;
  return state.snapshot;
};
