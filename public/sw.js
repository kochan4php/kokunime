// No build step for this file: the cache version comes from the registration
// URL (?v=<build id>) injected by src/components/sw-register.tsx — a new build
// registers a new script URL, activates it, and the old cache names are purged.
const VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const STATIC_CACHE = `kokunime-static-${VERSION}`;
const PAGES_CACHE = `kokunime-pages-${VERSION}`;
const API_CACHE = `kokunime-api-${VERSION}`;
// Saved-offline copies are intentionally unversioned: they must survive app
// updates so the user keeps the pages they explicitly saved.
const SAVED_CACHE = "kokunime-saved";
const SAVED_META_URL = "/__saved-offline";
const KEEP_CACHES = [STATIC_CACHE, PAGES_CACHE, API_CACHE, SAVED_CACHE];
// Soft caps per cache: CacheStorage preserves insertion order, so truncating
// the head evicts the oldest entries first (approximate LRU, good enough).
const CACHE_CAPS = { [PAGES_CACHE]: 90, [API_CACHE]: 150, [STATIC_CACHE]: 300 };

const OFFLINE_URL = "/offline";
const PRECACHE_URLS = [OFFLINE_URL, "/manifest.webmanifest", "/icon.svg"];

// The /offline document is a client component: without its own chunks it shows
// only the server shell when the network is gone. Parse the freshly fetched
// HTML for /_next/static/... URLs and keep those bytes too.
const precacheOfflineChunks = async (cache) => {
  try {
    const response = await fetch(OFFLINE_URL, { cache: "no-cache" });
    if (!response.ok) return;
    const html = await response.clone().text();
    await cache.put(OFFLINE_URL, response);
    const urls = [...new Set(html.match(/\/_next\/static\/[^"'\s\\]+/g) ?? [])];
    await Promise.all(urls.map((url) => cache.add(url).catch(() => {})));
  } catch {
    // Offline install (or a weird HTML shape) — the plain precache remains.
  }
};

// Pages worth keeping offline: app shell pages + anime detail pages. Anything
// else falls through to the /offline fallback.
const OFFLINE_PAGES = [/^\/$/, /^\/page\//, /^\/bookmarks/, /^\/genres/, /^\/seasons/, /^\/anime\//];

// Read-only APIs served stale-while-revalidate so detail pages stay functional
// offline. Mutations and auth endpoints are never cached.
const API_SWR = [/^\/api\/anime\//, /^\/api\/genres/, /^\/api\/seasons/, /^\/api\/recommend/, /^\/api\/search/];

const isOfflinePage = (pathname) => OFFLINE_PAGES.some((pattern) => pattern.test(pathname));

// Tell pages when data could not be refreshed (or arrived from the
// stale/fallback tier) so the UI can say "data per <time>" instead of silently
// showing old numbers. Cleared by any fresh, non-degraded response.
const DEGRADED_TIERS = new Set(["stale", "fallback"]);
const notifyDataState = (response) => {
  try {
    const tier = response.headers.get("X-Cache-Tier") || "";
    if (DEGRADED_TIERS.has(tier)) {
      broadcast({ type: "kokunime:data-stale", at: response.headers.get("date") || new Date().toISOString() });
    } else {
      broadcast({ type: "kokunime:data-fresh" });
    }
  } catch {}
};

const broadcast = (message) => {
  self.clients.matchAll({ type: "window" }).then((clients) => {
    for (const client of clients) client.postMessage(message);
  });
};

const notifyServedFromCache = () => broadcast({ type: "kokunime:served-from-cache" });

// --- Saved-offline bookkeeping ---------------------------------------------

const readSavedMeta = async () => {
  const cache = await caches.open(SAVED_CACHE);
  const response = await cache.match(SAVED_META_URL);
  if (!response) return [];
  try {
    const list = await response.json();
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const writeSavedMeta = async (list) => {
  const cache = await caches.open(SAVED_CACHE);
  await cache.put(SAVED_META_URL, new Response(JSON.stringify(list), { headers: { "content-type": "application/json" } }));
};

const saveOffline = async ({ url, title, apiUrls = [], imageUrls = [] }) => {
  const cache = await caches.open(SAVED_CACHE);
  const targets = [url, ...apiUrls, ...imageUrls];
  let failures = 0;

  for (const target of targets) {
    try {
      const response = await fetch(target, { cache: "no-cache" });
      if (!response.ok) {
        failures++;
        continue;
      }
      await cache.put(target, response);
    } catch {
      failures++;
    }
  }

  if (failures === targets.length) return false;

  const meta = await readSavedMeta();
  const next = [
    { url, title, addedAt: Date.now(), apiUrls, imageUrls },
    ...meta.filter((item) => item.url !== url),
  ].slice(0, 60);
  await writeSavedMeta(next);
  return true;
};

const removeOffline = async (url) => {
  const cache = await caches.open(SAVED_CACHE);
  const meta = await readSavedMeta();
  const entry = meta.find((item) => item.url === url);
  await cache.delete(url);
  for (const api of entry?.apiUrls ?? []) await cache.delete(api);
  for (const image of entry?.imageUrls ?? []) await cache.delete(image);
  await writeSavedMeta(meta.filter((item) => item.url !== url));
};

// Re-fetch one saved entry (page + APIs + poster). Used by "Perbarui" and by
// the background sync below; the network is allowed to still be down.
const refreshEntry = async (cache, item) => {
  const targets = [item.url, ...(item.apiUrls ?? []), ...(item.imageUrls ?? [])];
  let ok = false;
  for (const target of targets) {
    try {
      const response = await fetch(target, { cache: "no-cache" });
      if (response.ok) {
        await cache.put(target, response);
        ok = true;
      }
    } catch {
      // Still offline — keep the older copy.
    }
  }
  return ok;
};

// Background refresh (Sync / Periodic Sync, Chromium): re-fetch every saved
// page so return visits get fresh copies before going offline again.
const refreshSaved = async () => {
  const meta = await readSavedMeta();
  if (meta.length === 0) return;
  const cache = await caches.open(SAVED_CACHE);
  const refreshed = [];
  for (const item of meta) {
    if (await refreshEntry(cache, item)) refreshed.push({ ...item, refreshedAt: Date.now() });
    else refreshed.push(item);
  }
  await writeSavedMeta(refreshed);

  // Keep the shell APIs warm in the SWR cache so the next offline visit has
  // fresh data for the rails/inbox instead of whatever was cached at save time.
  const apiCache = await caches.open(API_CACHE);
  for (const api of SHELL_APIS) {
    try {
      const response = await fetch(api, { cache: "no-cache" });
      if (response.ok) await apiCache.put(api, response);
    } catch {
      // Offline — the previous copy stays.
    }
  }
};

// Shell APIs refreshed by sync/periodicsync (see refreshSaved).
const SHELL_APIS = ["/api/live", "/api/trending"];

const pruneCache = async (name) => {
  const maxEntries = CACHE_CAPS[name] ?? 100;
  const cache = await caches.open(name);
  const keys = await cache.keys();
  const excess = keys.length - maxEntries;
  for (let i = 0; i < excess; i++) await cache.delete(keys[i]);
};

// --- Offline action outbox (Background Sync, Chromium) -----------------------

// track-view pings that failed offline queue here and replay via the
// "kokunime-flush-queue" sync tag (fallback: an explicit flush message from
// the page when it comes back online).
const OUTBOX_DB = "kokunime-outbox";
const OUTBOX_STORE = "requests";

const openOutbox = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(OUTBOX_DB, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(OUTBOX_STORE)) {
        request.result.createObjectStore(OUTBOX_STORE, { autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const enqueueRequest = async (item) => {
  const db = await openOutbox();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(OUTBOX_STORE, "readwrite");
      tx.objectStore(OUTBOX_STORE).add(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
};

const flushOutbox = async () => {
  const db = await openOutbox();
  try {
    const items = await new Promise((resolve, reject) => {
      const store = db.transaction(OUTBOX_STORE, "readonly").objectStore(OUTBOX_STORE);
      const values = store.getAll();
      const keys = store.getAllKeys();
      values.transaction.oncomplete = () =>
        resolve(values.result.map((value, index) => ({ key: keys.result[index], value })));
      values.transaction.onerror = () => reject(values.transaction.error);
    });

    let flushed = 0;
    for (const item of items) {
      try {
        const response = await fetch(item.value.url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(item.value.body),
        });
        if (!response.ok) continue;
      } catch {
        break; // Still offline — keep the rest for the next sync.
      }
      await new Promise((resolve) => {
        const tx = db.transaction(OUTBOX_STORE, "readwrite");
        tx.objectStore(OUTBOX_STORE).delete(item.key);
        tx.oncomplete = resolve;
        tx.onerror = resolve;
      });
      flushed++;
    }
    return flushed;
  } finally {
    db.close();
  }
};

// --- Lifecycle --------------------------------------------------------------

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        cache
          .addAll(PRECACHE_URLS)
          .catch(() => {})
          .then(() => precacheOfflineChunks(cache)),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !KEEP_CACHES.includes(key)).map((key) => caches.delete(key))))
      .then(() => Promise.all(Object.keys(CACHE_CAPS).map((name) => pruneCache(name))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data.type !== "string") return;
  const reply = (payload) => {
    event.source?.postMessage(payload);
  };

  if (data.type === "kokunime:list-offline") {
    event.waitUntil(readSavedMeta().then((list) => reply({ type: "kokunime:offline-list", list })));
  } else if (data.type === "kokunime:save-offline") {
    event.waitUntil(
      saveOffline(data).then((ok) => {
        reply({ type: "kokunime:save-result", ok, url: data.url });
        broadcast({ type: "kokunime:offline-list-changed" });
      }),
    );
  } else if (data.type === "kokunime:remove-offline") {
    event.waitUntil(
      removeOffline(data.url).then(() => {
        reply({ type: "kokunime:remove-result", ok: true, url: data.url });
        broadcast({ type: "kokunime:offline-list-changed" });
      }),
    );
  } else if (data.type === "kokunime:refresh-offline") {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(SAVED_CACHE);
        const meta = await readSavedMeta();
        const targets = data.url ? meta.filter((item) => item.url === data.url) : meta;
        let refreshed = 0;
        for (const item of targets) {
          if (!(await refreshEntry(cache, item))) continue;
          refreshed++;
          const index = meta.findIndex((entry) => entry.url === item.url);
          if (index >= 0) meta[index] = { ...item, refreshedAt: Date.now() };
        }
        if (refreshed > 0) await writeSavedMeta(meta);
        reply({ type: "kokunime:refresh-result", ok: refreshed > 0, refreshed });
        if (refreshed > 0) broadcast({ type: "kokunime:offline-list-changed" });
      })(),
    );
  } else if (data.type === "kokunime:queue-track") {
    event.waitUntil(
      enqueueRequest({ url: "/api/track-view", body: data.body, at: Date.now() }).then(() => {
        const sync = self.registration.sync;
        if (sync) sync.register("kokunime-flush-queue").catch(() => {});
      }),
    );
  } else if (data.type === "kokunime:flush-queue") {
    event.waitUntil(flushOutbox().then(() => {}));
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === "kokunime-refresh-saved") {
    event.waitUntil(refreshSaved().then(() => broadcast({ type: "kokunime:offline-list-changed" })));
  } else if (event.tag === "kokunime-flush-queue") {
    event.waitUntil(
      flushOutbox().then((count) => {
        if (count > 0) broadcast({ type: "kokunime:outbox-flushed", count });
      }),
    );
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "kokunime-refresh-saved") {
    event.waitUntil(refreshSaved().then(() => broadcast({ type: "kokunime:offline-list-changed" })));
  }
});

// --- Fetch routing ----------------------------------------------------------

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // RSC payloads must NEVER be intercepted: navigation requests already carry
  // the page cache, RSC would double-cache responses.
  if (url.searchParams.has("_rsc") || request.headers.get("RSC") === "1") return;

  // Optimized images: a page saved offline also stores its poster, so serve the
  // saved copy when the network is down. Nothing is cached here — the rolling
  // caches stay free of image bytes.
  if (url.pathname.startsWith("/_next/image")) {
    event.respondWith(
      caches
        .open(SAVED_CACHE)
        .then((cache) => cache.match(request))
        .then((saved) => saved || fetch(request)),
    );
    return;
  }

  // Public read APIs: stale-while-revalidate.
  if (API_SWR.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(API_CACHE);
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
              notifyDataState(response);
            }
            return response;
          })
          .catch(() => {
            broadcast({
              type: "kokunime:data-stale",
              at: cached?.headers?.get("date") || new Date().toISOString(),
            });
            return undefined;
          });
        if (cached) return cached;
        const response = await network;
        if (response) return response;
        const saved = await caches.match(request);
        if (saved) return saved;
        return new Response(JSON.stringify({ error: "offline" }), {
          status: 503,
          headers: { "content-type": "application/json" },
        });
      })(),
    );
    return;
  }

  if (url.pathname.startsWith("/api/")) return;

  // Navigation requests: NETWORK-FIRST with offline listing/detail caching.
  // Saved-offline pages live in SAVED_CACHE and win over the rolling copy.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && isOfflinePage(url.pathname)) {
            const copy = response.clone();
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, copy));
          }
          notifyDataState(response);
          return response;
        })
        .catch(async () => {
          const saved = await caches.open(SAVED_CACHE).then((cache) => cache.match(request));
          if (saved) {
            notifyServedFromCache();
            return saved;
          }
          const cached = await caches.match(request);
          if (cached) {
            notifyServedFromCache();
            return cached;
          }
          return caches.match(OFFLINE_URL);
        }),
    );
    return;
  }

  // Static immutable assets (_next/static/...) -> cache-first.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      }),
    );
    return;
  }
});
