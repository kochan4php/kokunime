const CACHE = "kokunime-v6";
const NAV_FRESH_MS = 60 * 60 * 1000; // serve cached navigations only within 1h
const PRECACHE_URLS = ["/", "/bookmarks", "/offline", "/manifest.webmanifest"];

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

  // Images are already cached by the browser via the image optimizer's HTTP cache.
  if (request.url.includes("/_next/image")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      caches.match(request).then((cached) => {
        // Repeat visit within the freshness window: serve instantly from cache.
        // Older than that (or missing): network, then refresh the cache entry.
        const fresh = cached && Date.now() - new Date(cached.headers.get("date") || 0).getTime() < NAV_FRESH_MS;
        if (fresh) return cached;

        const fetched = fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached || caches.match("/offline") || caches.match("/bookmarks") || caches.match("/"));
        return fetched;
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    }),
  );
});
