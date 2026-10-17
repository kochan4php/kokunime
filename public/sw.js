// No build step for this file: the cache version comes from the registration
// URL (?v=<build id>) injected by src/components/sw-register.tsx — a new build
// registers a new script URL, activates it, and the old cache names are purged.
const VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const CACHE = `kokunime-${VERSION}`;
const OFFLINE_URL = "/offline";
const PRECACHE_URLS = [OFFLINE_URL, "/manifest.webmanifest", "/icon.svg"];

// Pages worth keeping offline: app shell pages + anime detail pages. Anything
// else falls through to the /offline fallback.
const OFFLINE_PAGES = [/^\/$/, /^\/page\//, /^\/bookmarks/, /^\/genres/, /^\/seasons/, /^\/anime\//];

const isOfflinePage = (pathname) => OFFLINE_PAGES.some((pattern) => pattern.test(pathname));

const notifyServedFromCache = () => {
  self.clients.matchAll({ type: "window" }).then((clients) => {
    for (const client of clients) client.postMessage({ type: "kokunime:served-from-cache" });
  });
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Dynamic endpoints, APIs, RSC payloads, and image optimizers must NEVER be intercepted by SW cache.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/image") ||
    url.searchParams.has("_rsc") ||
    request.headers.get("RSC") === "1"
  ) {
    return;
  }

  // Navigation requests: NETWORK-FIRST with offline listing/detail caching.
  // Always fetch live data on normal reload. When successful, cache app-shell
  // listings and /anime/[slug]. If completely offline, serve the last cached
  // copy (flagged to the UI via postMessage) or the /offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && isOfflinePage(url.pathname)) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
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

  // Static immutable assets (_next/static/...) -> Stale-while-revalidate / Cache-first
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      }),
    );
    return;
  }
});
