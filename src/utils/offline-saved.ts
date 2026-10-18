"use client";

export interface SavedOfflineEntry {
  url: string;
  title: string;
  addedAt: number;
  refreshedAt?: number;
  pinned?: boolean;
  apiUrls?: string[];
  imageUrls?: string[];
}

const SAVED_CACHE = "kokunime-saved";
const SAVED_META_URL = "/__saved-offline";
const MAX_SAVED_OFFLINE = 60;
const OFFLINE_LIST_EVENT = "kokunime:offline-list-changed";

// CacheStorage insertion order is the LRU stand-in: callers pass entries
// newest-first. Pins are never evicted, even beyond the cap — the UI shows the
// storage warning instead of silently dropping a deliberate save.
export const evictSavedEntries = (
  list: SavedOfflineEntry[],
  cap = MAX_SAVED_OFFLINE,
): { keep: SavedOfflineEntry[]; evicted: SavedOfflineEntry[] } => {
  if (list.length <= cap) return { keep: list, evicted: [] };
  const pinnedCount = list.filter((entry) => entry.pinned).length;
  const budget = Math.max(0, cap - pinnedCount);
  let unpinnedKept = 0;
  const keep: SavedOfflineEntry[] = [];
  const evicted: SavedOfflineEntry[] = [];
  for (const entry of list) {
    if (entry.pinned) {
      keep.push(entry);
    } else if (unpinnedKept < budget) {
      keep.push(entry);
      unpinnedKept += 1;
    } else {
      evicted.push(entry);
    }
  }
  return { keep, evicted };
};

type SwMessage = { type?: string } & Record<string, unknown>;

const askServiceWorker = (
  message: Record<string, unknown>,
  expectType: string,
  timeoutMs: number,
): Promise<SwMessage | undefined> => {
  const controller = navigator.serviceWorker?.controller;
  if (!controller) return Promise.resolve(undefined);

  return new Promise((resolve) => {
    const onMessage = (event: MessageEvent<SwMessage>) => {
      if (event.data?.type !== expectType) return;
      window.clearTimeout(timer);
      navigator.serviceWorker.removeEventListener("message", onMessage);
      resolve(event.data);
    };
    const timer = window.setTimeout(() => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
      resolve(undefined);
    }, timeoutMs);
    navigator.serviceWorker.addEventListener("message", onMessage);
    controller.postMessage(message);
  });
};

const readMetaDirect = async (): Promise<SavedOfflineEntry[]> => {
  try {
    const cache = await caches.open(SAVED_CACHE);
    const response = await cache.match(SAVED_META_URL);
    if (!response) return [];
    const list = await response.json();
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const writeMetaDirect = async (list: SavedOfflineEntry[]): Promise<void> => {
  const cache = await caches.open(SAVED_CACHE);
  await cache.put(
    SAVED_META_URL,
    new Response(JSON.stringify(list), { headers: { "content-type": "application/json" } }),
  );
};

export const listSavedOffline = async (): Promise<SavedOfflineEntry[]> => {
  if (!("caches" in window)) return [];
  const viaWorker = await askServiceWorker({ type: "kokunime:list-offline" }, "kokunime:offline-list", 1_500);
  if (Array.isArray(viaWorker?.list)) return viaWorker.list as SavedOfflineEntry[];
  return readMetaDirect();
};

export const saveOfflineEntry = async (entry: {
  url: string;
  title: string;
  apiUrls?: string[];
  imageUrls?: string[];
}): Promise<boolean> => {
  if (!("caches" in window)) return false;

  const viaWorker = await askServiceWorker({ type: "kokunime:save-offline", ...entry }, "kokunime:save-result", 20_000);
  if (viaWorker) return viaWorker.ok === true;

  // No active worker (dev or first load): write CacheStorage directly.
  try {
    const cache = await caches.open(SAVED_CACHE);
    let saved = 0;
    for (const target of [entry.url, ...(entry.apiUrls ?? []), ...(entry.imageUrls ?? [])]) {
      try {
        const response = await fetch(target, { cache: "no-cache" });
        if (response.ok) {
          await cache.put(target, response);
          saved++;
        }
      } catch {
        // Skip individual failures; the page copy is what matters.
      }
    }
    if (saved === 0) return false;
    const meta = await readMetaDirect();
    const { keep, evicted } = evictSavedEntries([
      { ...entry, addedAt: Date.now() },
      ...meta.filter((item) => item.url !== entry.url),
    ]);
    await writeMetaDirect(keep);
    for (const removed of evicted) {
      await cache.delete(removed.url);
      for (const target of removed.apiUrls ?? []) await cache.delete(target);
      for (const target of removed.imageUrls ?? []) await cache.delete(target);
    }
    return true;
  } catch {
    return false;
  }
};

export const removeOfflineEntry = async (url: string): Promise<void> => {
  if (!("caches" in window)) return;

  const viaWorker = await askServiceWorker({ type: "kokunime:remove-offline", url }, "kokunime:remove-result", 3_000);
  if (viaWorker) return;

  try {
    const cache = await caches.open(SAVED_CACHE);
    const meta = await readMetaDirect();
    const entry = meta.find((item) => item.url === url);
    await cache.delete(url);
    for (const api of entry?.apiUrls ?? []) await cache.delete(api);
    for (const image of entry?.imageUrls ?? []) await cache.delete(image);
    await writeMetaDirect(meta.filter((item) => item.url !== url));
  } catch {
    // Nothing else to do — the entry stays until the next attempt.
  }
};

// Re-fetch saved copies (one entry, or every entry when url is omitted).
export const refreshOfflineSaved = async (url?: string): Promise<boolean> => {
  if (!("caches" in window)) return false;

  const viaWorker = await askServiceWorker(
    { type: "kokunime:refresh-offline", url },
    "kokunime:refresh-result",
    20_000,
  );
  if (viaWorker) return viaWorker.ok === true;

  // Direct fallback: refresh the requested entries without the worker.
  try {
    const cache = await caches.open(SAVED_CACHE);
    const meta = await readMetaDirect();
    const targets = url ? meta.filter((item) => item.url === url) : meta;
    let refreshed = 0;
    for (const item of targets) {
      let ok = false;
      for (const target of [item.url, ...(item.apiUrls ?? []), ...(item.imageUrls ?? [])]) {
        try {
          const response = await fetch(target, { cache: "no-cache" });
          if (response.ok) {
            await cache.put(target, response);
            ok = true;
          }
        } catch {
          // Still offline for this target — keep the older copy.
        }
      }
      if (ok) {
        refreshed++;
        const index = meta.findIndex((entry) => entry.url === item.url);
        if (index >= 0) meta[index] = { ...item, refreshedAt: Date.now() };
      }
    }
    if (refreshed > 0) await writeMetaDirect(meta);
    return refreshed > 0;
  } catch {
    return false;
  }
};

export const setOfflinePinned = async (url: string, pinned: boolean): Promise<boolean> => {
  if (!("caches" in window)) return false;
  const viaWorker = await askServiceWorker({ type: "kokunime:pin-offline", url, pinned }, "kokunime:pin-result", 3_000);
  if (viaWorker) return viaWorker.ok === true;

  try {
    const meta = await readMetaDirect();
    await writeMetaDirect(meta.map((item) => (item.url === url ? { ...item, pinned } : item)));
    return true;
  } catch {
    return false;
  }
};

interface OfflineBatchEstimate {
  estimatedBytes: number;
  remainingBytes: number;
  affordable: number;
}

// Quota warning threshold shared by the hub: 80% of the origin quota.
export const isQuotaTight = (usage: number, quota: number): boolean => quota > 0 && usage / quota >= 0.8;

// Rough per-entry cost: the page shell plus two API payloads. Posters are only
// cached when they are same-origin optimizer URLs, so they are left out.
const PER_ENTRY_BYTES = 180 * 1024;

export const estimateOfflineBatch = async (count: number): Promise<OfflineBatchEstimate> => {
  let quota = 0;
  let usage = 0;
  try {
    const estimate = await navigator.storage?.estimate?.();
    quota = estimate?.quota ?? 0;
    usage = estimate?.usage ?? 0;
  } catch {
    // Estimate unsupported — treat the whole batch as affordable.
  }
  const remainingBytes = quota > 0 ? Math.max(0, quota - usage) : Number.POSITIVE_INFINITY;
  const affordable = quota > 0 ? Math.min(count, Math.floor(remainingBytes / PER_ENTRY_BYTES)) : count;
  return { estimatedBytes: count * PER_ENTRY_BYTES, remainingBytes, affordable };
};

const waitForIdle = (): Promise<void> =>
  new Promise((resolve) => {
    const ric = (
      window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      }
    ).requestIdleCallback;
    if (ric) ric(() => resolve(), { timeout: 2_000 });
    else window.setTimeout(resolve, 0);
  });

interface OfflineBatchItem {
  slug: string;
  title: string;
}

// One entry per idle slice so a bulk save never blocks scrolling; stops when
// the connection drops (the remaining entries can be retried later).
export const saveOfflineBatch = async (
  items: OfflineBatchItem[],
  onProgress?: (done: number, total: number) => void,
): Promise<number> => {
  let saved = 0;
  for (const [index, item] of items.entries()) {
    if (!navigator.onLine) break;
    const ok = await saveOfflineEntry({
      url: `/anime/${item.slug}`,
      title: item.title,
      apiUrls: [`/api/anime/${item.slug}`, `/api/anime/${item.slug}/download`],
    });
    if (ok) saved += 1;
    onProgress?.(index + 1, items.length);
    await waitForIdle();
  }
  return saved;
};

export type RollingCacheKind = "pages" | "api";

// Clears the rolling navigation/API caches only — never the explicit saves.
export const clearRollingCache = async (kind: RollingCacheKind): Promise<number> => {
  if (!("caches" in window)) return 0;
  const prefix = `kokunime-${kind}-`;
  const keys = await caches.keys();
  let cleared = 0;
  for (const key of keys) {
    if (key.startsWith(prefix) && (await caches.delete(key))) cleared += 1;
  }
  return cleared;
};

export const subscribeOfflineSaved = (listener: () => void): (() => void) => {
  if (!("serviceWorker" in navigator)) return () => {};
  const onMessage = (event: MessageEvent<{ type?: string }>) => {
    if (event.data?.type === OFFLINE_LIST_EVENT) listener();
  };
  navigator.serviceWorker.addEventListener("message", onMessage);
  return () => navigator.serviceWorker.removeEventListener("message", onMessage);
};
