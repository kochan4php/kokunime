// Post-deploy cache warmer: fetches the top `LIMIT` sitemap URLs so ISR/edge
// caches are hot for real visitors. Best-effort by design — a failed warm must
// never fail the deploy.
const rawBase = process.argv[2] || process.env.PRODUCTION_URL || process.env.SITE_URL || "";
const BASE = rawBase.replace(/\/$/, "");
const LIMIT = Number(process.env.WARM_LIMIT || 50);
const CONCURRENCY = 4;

if (!BASE) {
  console.log("warm-cache: no base URL (argument or PRODUCTION_URL) — skipping");
  process.exit(0);
}

const extractLocs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) => match[1]);

async function fetchText(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

async function collectUrls() {
  const xml = await fetchText(`${BASE}/sitemap.xml`);
  const locs = extractLocs(xml);
  if (!xml.includes("<sitemapindex")) return locs;

  // Sitemap index: walk the page-ish children first, then any others.
  const children = [...locs].sort((a, b) => {
    const score = (u) => (/pages|static|main/.test(u) ? 0 : 1);
    return score(a) - score(b);
  });
  const urls = [];
  for (const child of children.slice(0, 4)) {
    try {
      urls.push(...extractLocs(await fetchText(child)));
    } catch (error) {
      console.log(`  ⚠ skip ${child}: ${error.message}`);
    }
    if (urls.length >= LIMIT) break;
  }
  return urls;
}

const main = async () => {
  let targets = [];
  try {
    targets = [...new Set(await collectUrls())].slice(0, LIMIT);
  } catch (error) {
    console.log(`warm-cache: cannot read sitemap (${error.message}) — skipping`);
    process.exit(0);
  }

  if (targets.length === 0) {
    console.log("warm-cache: sitemap has no URLs — nothing to warm");
    process.exit(0);
  }

  console.log(`warm-cache: fetching ${targets.length} URL(s) from ${BASE}`);
  let ok = 0;
  let failed = 0;

  for (let i = 0; i < targets.length; i += CONCURRENCY) {
    await Promise.all(
      targets.slice(i, i + CONCURRENCY).map(async (url) => {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(25_000) });
          await res.arrayBuffer(); // consume body so the render completes
          if (res.ok) ok++;
          else failed++;
        } catch {
          failed++;
        }
      }),
    );
  }

  console.log(`✓ warm-cache done: ${ok} ok, ${failed} failed`);
  // All-URL failure almost always means a wrong base URL, not slow renders.
  if (ok === 0) process.exit(1);
};

main().catch((error) => {
  console.log(`warm-cache: unexpected error (${error.message}) — skipping`);
  process.exit(0);
});
