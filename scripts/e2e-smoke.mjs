const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Route checks: expected status + optional body substring (SEO/feed contracts).
const routes = [
  { path: "/", status: 200, contains: "application/ld+json" },
  { path: "/update", status: 200 },
  { path: "/bookmarks", status: 200 },
  { path: "/genres", status: 200 },
  { path: "/seasons", status: 200 },
  { path: "/compare", status: 200 },
  { path: "/offline", status: 200 },
  { path: "/robots.txt", status: 200, contains: "Sitemap" },
  { path: "/sitemap.xml", status: 200, contains: "<sitemapindex" },
  { path: "/manifest.webmanifest", status: 200, contains: '"name"' },
  { path: "/feed.xml", status: 200, contains: "<rss" },
  { path: "/feed.json", status: 200 },
  { path: "/api/live", status: 200, contains: '"ok"' },
  { path: "/api/health", status: 200 },
  { path: "/api/genres", status: 200, contains: '"genres"' },
  { path: "/api/mock", status: 200 },
];

async function checkRoute({ path, status, contains }) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { signal: AbortSignal.timeout(20_000) });
    if (res.status !== status) {
      return { ok: false, reason: `expected HTTP ${status}, got ${res.status}` };
    }
    if (contains) {
      const body = await res.text();
      if (!body.includes(contains)) {
        return { ok: false, reason: `body missing ${JSON.stringify(contains)}` };
      }
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: `network error: ${err.message}` };
  }
}

async function runSmokeTests() {
  console.log(`\n🚀 Starting E2E Smoke Tests against: ${BASE_URL}`);

  const results = await Promise.all(routes.map(async (route) => ({ route, result: await checkRoute(route) })));

  let passed = 0;
  for (const { route, result } of results) {
    if (result.ok) {
      passed++;
      console.log(`  ✓ ${route.path}`);
    } else {
      console.log(`  × ${route.path} -> ${result.reason}`);
    }
  }

  console.log(`\n📊 Smoke Test Summary: ${passed}/${routes.length} passed.`);

  // Non-zero exit when anything fails, so CI canary jobs can detect it.
  if (passed !== routes.length) {
    process.exitCode = 1;
  }
}

// The first /sitemap.xml request on a cold container (no Redis snapshot) fans
// out to ~52 upstream calls and outlives the 20s per-route budget below. Warm
// it once with a longer budget; the real assertion still runs afterwards.
async function warmHeavyRoutes() {
  try {
    await fetch(`${BASE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(120_000) });
  } catch (err) {
    console.log(`  ⚠ sitemap warm-up failed: ${err.message}`);
  }
}

async function main() {
  await warmHeavyRoutes();
  await runSmokeTests();
}

main();
