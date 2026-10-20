// Pings IndexNow (Bing/Yandex/Seznam/Naver) with only the sitemap URLs whose
// lastmod changed since the last successful run. The key file
// (public/<key>.txt) is served publicly; no secret needed here.
// Usage: SITE_URL=https://example.com node scripts/indexnow.mjs
//        DRY_RUN=1 ... (prints the diff, writes nothing, pings nothing)
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { diffSitemap, mergeSubmitted, parseSitemapEntries, parseSitemapLocs } from "./lib/indexnow-state.mjs";

const SITE = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 500;
const STATE_FILE = process.env.INDEXNOW_STATE_FILE || ".indexnow-state/submitted.json";
const DRY_RUN = process.env.DRY_RUN === "1";
const isSiteUrl = (url) => url === SITE || url.startsWith(`${SITE}/`);

const readState = () => {
  try {
    const parsed = JSON.parse(readFileSync(STATE_FILE, "utf8"));
    return parsed && typeof parsed.urls === "object" && parsed.urls !== null ? parsed.urls : {};
  } catch {
    return {};
  }
};

const writeState = (urls) => {
  mkdirSync(dirname(STATE_FILE), { recursive: true });
  writeFileSync(STATE_FILE, `${JSON.stringify({ version: 1, urls })}\n`);
};

const fetchEntries = async () => {
  const sitemapRes = await fetch(`${SITE}/sitemap.xml`);
  if (!sitemapRes.ok) throw new Error(`sitemap fetch failed: HTTP ${sitemapRes.status}`);
  const xml = await sitemapRes.text();
  if (!/<sitemapindex/i.test(xml)) return parseSitemapEntries(xml);

  const entries = [];
  for (const chunk of parseSitemapLocs(xml)) {
    if (!isSiteUrl(chunk)) {
      console.error(`chunk ${chunk}: outside ${SITE}, skipped`);
      continue;
    }
    try {
      const chunkRes = await fetch(chunk);
      if (!chunkRes.ok) {
        console.error(`chunk ${chunk}: HTTP ${chunkRes.status}`);
        continue;
      }
      entries.push(...parseSitemapEntries(await chunkRes.text()));
    } catch (err) {
      console.error(`chunk ${chunk} failed:`, err instanceof Error ? err.message : err);
    }
  }
  return entries;
};

const main = async () => {
  if (!SITE) {
    console.error("SITE_URL is required (e.g. SITE_URL=https://example.com node scripts/indexnow.mjs)");
    return 1;
  }

  const keyFile = readdirSync("public").find((file) => /^[0-9a-f]{32}\.txt$/.test(file));
  if (!keyFile) {
    console.error("IndexNow key file not found in public/ (expected 32-hex-name .txt)");
    return 1;
  }
  const key = keyFile.replace(/\.txt$/, "");

  let allEntries;
  try {
    allEntries = await fetchEntries();
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    return 1;
  }
  const entries = allEntries.filter((entry) => isSiteUrl(entry.url));
  if (entries.length !== allEntries.length) {
    console.error(`entries: ${allEntries.length - entries.length} outside ${SITE}, skipped`);
  }
  const previous = readState();
  const { changed, state } = diffSitemap(previous, entries);
  console.log(
    `IndexNow: site=${SITE} key=${key.slice(0, 8)}... sitemap=${entries.length} changed=${changed.length}${
      DRY_RUN ? " (dry run)" : ""
    }`,
  );

  if (changed.length === 0) return 0;
  if (DRY_RUN) {
    console.log(`would submit: ${changed.slice(0, 10).join(", ")}${changed.length > 10 ? ", ..." : ""}`);
    return 0;
  }

  const submitted = new Set();
  let failures = 0;
  for (let i = 0; i < changed.length; i += BATCH_SIZE) {
    const urlList = changed.slice(i, i + BATCH_SIZE);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${keyFile}`, urlList }),
      });
      console.log(`batch ${i / BATCH_SIZE + 1}: HTTP ${res.status} (${urlList.length} urls)`);
      if (res.status >= 400) failures++;
      else for (const url of urlList) submitted.add(url);
    } catch (err) {
      console.error(`batch ${i / BATCH_SIZE + 1} failed:`, err instanceof Error ? err.message : err);
      failures++;
    }
  }

  // Persist only successful submissions; failed URLs stay "changed" and retry.
  const nextState = mergeSubmitted(previous, state, submitted);
  try {
    writeState(nextState);
    console.log(`state: ${Object.keys(nextState).length} urls saved to ${STATE_FILE}`);
  } catch (err) {
    console.error(`state write failed:`, err instanceof Error ? err.message : err);
    failures++;
  }

  return failures > 0 ? 1 : 0;
};

process.exitCode = await main();
