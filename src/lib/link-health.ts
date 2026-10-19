import { AnimeDetail, LinkHealthRecord, LinkHealthSnapshot, LinkHealthState } from "@/interfaces";
import { redisGet, redisSet } from "@/lib/redis";
import { fetchWithRedirectGuard, isPublicHttpUrl } from "@/lib/url-guard";

// Link checks are opt-in and run from the admin console/cron. Detail pages only
// read the last snapshot: a slow mirror must never hold up a page render.
const SNAPSHOT_TTL_SECONDS = 7 * 24 * 60 * 60;
const CHECK_TIMEOUT_MS = 6_000;
const MAX_LINKS_PER_RUN = 30;
const CONCURRENCY = 5;

interface MemoryEntry {
  snapshot: LinkHealthSnapshot;
  expiresAt: number;
}

const memory = new Map<string, MemoryEntry>();

const isSnapshot = (value: unknown): value is LinkHealthSnapshot => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LinkHealthSnapshot>;
  return (
    typeof candidate.checkedAt === "string" &&
    typeof candidate.total === "number" &&
    typeof candidate.checked === "number" &&
    typeof candidate.truncated === "boolean" &&
    Boolean(candidate.records) &&
    typeof candidate.records === "object"
  );
};

const remember = (slug: string, snapshot: LinkHealthSnapshot): void => {
  memory.set(slug, { snapshot, expiresAt: Date.now() + SNAPSHOT_TTL_SECONDS * 1000 });
};

// A magnet cannot be verified with HTTP; say so instead of pretending it is
// dead or healthy.
export const classifyLinkStatus = (status: number): LinkHealthState => {
  if (status >= 200 && status < 300) return "ok";
  if (status === 404 || status === 410) return "dead";
  if (status === 401 || status === 403 || status === 429) return "blocked";
  return "error";
};

export const extractDownloadUrls = (anime: AnimeDetail): string[] => {
  const seen = new Set<string>();
  for (const group of anime.download ?? []) {
    for (const resolution of group.link_download ?? []) {
      for (const target of resolution.link ?? []) {
        const url = target.url?.trim();
        if (url) seen.add(url);
      }
    }
  }
  return [...seen];
};

export const checkLink = async (url: string, timeoutMs = CHECK_TIMEOUT_MS): Promise<LinkHealthRecord> => {
  const checkedAt = new Date().toISOString();
  if (/^magnet:\?/i.test(url)) return { state: "unverifiable", checkedAt };
  // Download URLs come from upstream HTML; never let one point at localhost,
  // a private network, or a non-HTTP scheme.
  if (!isPublicHttpUrl(url)) return { state: "blocked", checkedAt };

  try {
    const response = await fetchWithRedirectGuard(url, {
      method: "GET",
      headers: {
        Range: "bytes=0-0",
        "User-Agent": "Kokunime-LinkHealth/1.0",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    // Cancel the body immediately: some mirrors ignore Range and would
    // otherwise stream a whole episode into this process.
    if (response.body) {
      try {
        await response.body.cancel();
      } catch {
        // Body already closed — nothing to cancel.
      }
    }
    return {
      state: classifyLinkStatus(response.status),
      status: response.status,
      checkedAt,
      finalUrl: response.url || undefined,
    };
  } catch (error) {
    const name = (error as Error)?.name;
    const message = (error as Error)?.message ?? "";
    if (name === "TimeoutError" || name === "AbortError") return { state: "timeout", checkedAt };
    if (/Blocked|Too many redirects/i.test(message)) return { state: "blocked", checkedAt };
    return { state: "error", checkedAt };
  }
};

export const checkAnimeLinkHealth = async (anime: AnimeDetail, maxLinks = 20): Promise<LinkHealthSnapshot> => {
  const all = extractDownloadUrls(anime);
  const limit = Number.isFinite(maxLinks) ? Math.max(1, Math.min(MAX_LINKS_PER_RUN, Math.floor(maxLinks))) : 20;
  const urls = all.slice(0, limit);
  const records: Record<string, LinkHealthRecord> = {};
  let cursor = 0;

  const workers = Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      const url = urls[index];
      if (!url) return;
      records[url] = await checkLink(url);
    }
  });
  await Promise.all(workers);

  return {
    checkedAt: new Date().toISOString(),
    total: all.length,
    checked: urls.length,
    truncated: all.length > urls.length,
    records,
  };
};

export const saveAnimeLinkHealth = async (slug: string, snapshot: LinkHealthSnapshot): Promise<void> => {
  remember(slug, snapshot);
  await redisSet(`link-health:${slug}`, snapshot, SNAPSHOT_TTL_SECONDS);
};

export const getAnimeLinkHealth = async (slug: string): Promise<LinkHealthSnapshot | null> => {
  const local = memory.get(slug);
  if (local && local.expiresAt > Date.now()) return local.snapshot;

  const shared = await redisGet(`link-health:${slug}`);
  if (!isSnapshot(shared)) return null;
  remember(slug, shared);
  return shared;
};
