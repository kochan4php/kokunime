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

// Pages worth keeping offline: app shell pages + anime detail pages. Anything
// else falls through to the /offline fallback.
const OFFLINE_PAGES = [/^\/$/, /^\/page\//, /^\/bookmarks/, /^\/genres/, /^\/seasons/, /^\/anime\//];

// Read-only APIs served stale-while-revalidate so detail pages stay functional
// offline. Mutations and auth endpoints are never cached.
const API_SWR = [/^\/api\/anime\//, /^\/api\/genres/, /^\/api\/seasons/, /^\/api\/recommend/, /^\/api\/search/];

const isOfflinePage = (pathname) => OFFLINE_PAGES.some((pattern) => pattern.test(pathname));

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

const saveOffline = async ({ url, title, apiUrls = [] }) => {
  const cache = await caches.open(SAVED_CACHE);
  const targets = [url, ...apiUrls];
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
  const next = [{ url, title, addedAt: Date.now(), apiUrls }, ...meta.filter((item) => item.url !== url)].slice(0, 60);
  await writeSavedMeta(next);
  return true;
};

const removeOffline = async (url) => {
  const cache = await caches.open(SAVED_CACHE);
  const meta = await readSavedMeta();
  const entry = meta.find((item) => item.url === url);
  await cache.delete(url);
  for (const api of entry?.apiUrls ?? []) await cache.delete(api);
  await writeSavedMeta(meta.filter((item) => item.url !== url));
};

// Background refresh (Sync / Periodic Sync, Chromium): re-fetch every saved
// page so return visits get fresh copies before going offline again.
const refreshSaved = async () => {
  const meta = await readSavedMeta();
  if (meta.length === 0) return;
  const cache = await caches.open(SAVED_CACHE);
  for (const item of meta) {
    try {
      const response = await fetch(item.url, { cache: "no-cache" });
      if (response.ok) await cache.put(item.url, response);
    } catch {
      // Still offline — keep the older copy.
    }
  }

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
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
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

  // RSC payloads and image optimizers must NEVER be intercepted: navigation
  // requests already carry the page cache, RSC would double-cache responses.
  if (url.pathname.startsWith("/_next/image") || url.searchParams.has("_rsc") || request.headers.get("RSC") === "1") {
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
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => undefined);
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
