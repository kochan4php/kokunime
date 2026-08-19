const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runSmokeTests() {
  console.log(`\n🚀 Starting E2E Smoke Tests against: ${BASE_URL}`);

  const routes = [
    { path: "/", status: 200 },
    { path: "/bookmarks", status: 200 },
    { path: "/api/health", status: 200 },
    { path: "/api/genres", status: 200 },
    { path: "/api/mock", status: 200 },
  ];

  let passed = 0;
  for (const route of routes) {
    try {
      const res = await fetch(`${BASE_URL}${route.path}`);
      if (res.status === route.status) {
        console.log(`  ✓ ${route.path} -> HTTP ${res.status}`);
        passed++;
      } else {
        console.log(`  × ${route.path} -> Expected ${route.status}, got ${res.status}`);
      }
    } catch (err) {
      console.log(`  × ${route.path} -> Network Error: ${err.message}`);
    }
  }

  console.log(`\n📊 Smoke Test Summary: ${passed}/${routes.length} passed.`);
}

runSmokeTests();
