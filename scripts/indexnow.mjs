// Pings IndexNow (Bing/Yandex/Seznam/Naver) with every URL from the live sitemap.
// Usage: SITE_URL=https://example.com node scripts/indexnow.mjs
// The key file (public/<key>.txt) is served publicly; no secret needed here.
import { readdirSync } from "node:fs";

const SITE = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://kokunime.netlify.app").replace(
  /\/$/,
  "",
);
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 500;

const keyFile = readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error("IndexNow key file not found in public/ (expected 32-hex-name .txt)");
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, "");

console.log(`IndexNow: site=${SITE} key=${key.slice(0, 8)}...`);

const sitemapRes = await fetch(`${SITE}/sitemap.xml`);
if (!sitemapRes.ok) {
  console.error(`Sitemap fetch failed: HTTP ${sitemapRes.status}`);
  process.exit(1);
}
const xml = await sitemapRes.text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].replaceAll("&amp;", "&"));
console.log(`Sitemap URLs: ${urls.length}`);

let failures = 0;
for (let i = 0; i < urls.length; i += BATCH_SIZE) {
  const urlList = urls.slice(i, i + BATCH_SIZE);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${keyFile}`, urlList }),
    });
    console.log(`batch ${i / BATCH_SIZE + 1}: HTTP ${res.status} (${urlList.length} urls)`);
    if (res.status >= 400) failures++;
  } catch (err) {
    console.error(`batch ${i / BATCH_SIZE + 1} failed:`, err instanceof Error ? err.message : err);
    failures++;
  }
}

process.exitCode = failures > 0 ? 1 : 0;
