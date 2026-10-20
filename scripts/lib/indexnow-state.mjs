// Pure helpers for scripts/indexnow.mjs. Kept separate so the diff logic can
// be tested without fetching the sitemap or pinging IndexNow.

const decodeXml = (value) => value.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">");

// Parses <url> blocks from a sitemap chunk. Returns { url, lastmod } where
// lastmod is "" when the sitemap omitted it.
export const parseSitemapEntries = (xml) =>
  [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].flatMap(([, block]) => {
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1];
    if (!loc) return [];
    const lastmod = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1] ?? "";
    return [{ url: decodeXml(loc.trim()), lastmod: lastmod.trim() }];
  });

// Every <loc> in a sitemap index (which uses <sitemap> blocks, not <url>).
export const parseSitemapLocs = (xml) =>
  [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => decodeXml(match[1].trim()));

// A URL counts as changed when it is new or its lastmod differs from the last
// successful submission. State keeps only URLs still present in the sitemap.
export const diffSitemap = (previous, entries) => {
  const state = {};
  const changed = [];
  for (const { url, lastmod } of entries) {
    const stamp = lastmod ?? "";
    state[url] = stamp;
    if (previous[url] !== stamp) changed.push(url);
  }
  return { changed, state };
};

// Keeps unchanged URLs plus changed URLs that were submitted successfully, so
// failed batches are retried on the next run.
export const mergeSubmitted = (previous, next, submitted) => {
  const merged = {};
  for (const [url, stamp] of Object.entries(next)) {
    if (previous[url] === stamp || submitted.has(url)) merged[url] = stamp;
  }
  return merged;
};
