"use client";

export interface SavedOfflineEntry {
  url: string;
  title: string;
  addedAt: number;
  apiUrls?: string[];
}

const SAVED_CACHE = "kokunime-saved";
const SAVED_META_URL = "/__saved-offline";
const OFFLINE_LIST_EVENT = "kokunime:offline-list-changed";

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
}): Promise<boolean> => {
  if (!("caches" in window)) return false;

  const viaWorker = await askServiceWorker({ type: "kokunime:save-offline", ...entry }, "kokunime:save-result", 20_000);
  if (viaWorker) return viaWorker.ok === true;

  // No active worker (dev or first load): write CacheStorage directly.
  try {
    const cache = await caches.open(SAVED_CACHE);
    let saved = 0;
    for (const target of [entry.url, ...(entry.apiUrls ?? [])]) {
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
    await writeMetaDirect(
      [{ ...entry, addedAt: Date.now() }, ...meta.filter((item) => item.url !== entry.url)].slice(0, 60),
    );
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
    await writeMetaDirect(meta.filter((item) => item.url !== url));
  } catch {
    // Nothing else to do — the entry stays until the next attempt.
  }
};

export const subscribeOfflineSaved = (listener: () => void): (() => void) => {
  if (!("serviceWorker" in navigator)) return () => {};
  const onMessage = (event: MessageEvent<{ type?: string }>) => {
    if (event.data?.type === OFFLINE_LIST_EVENT) listener();
  };
  navigator.serviceWorker.addEventListener("message", onMessage);
  return () => navigator.serviceWorker.removeEventListener("message", onMessage);
};
