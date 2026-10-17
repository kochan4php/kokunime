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
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === "kokunime-refresh-saved") {
    event.waitUntil(refreshSaved().then(() => broadcast({ type: "kokunime:offline-list-changed" })));
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
