// Perf gate: measures LCP / CLS / long tasks in real Chrome (CDP) against a
// running server and fails when a route blows its budget. Run against a
// production build (`pnpm build && pnpm start`) for meaningful numbers.
//
//   node scripts/perf-budget.mjs                    # http://localhost:3000
//   BASE_URL=http://localhost:8000 LCP_BUDGET_MS=3000 node scripts/perf-budget.mjs
//
// Skips (exit 0) when no Chrome/Edge is installed.
import { evaluate, findBrowser, launchBrowser, navigate, sleep } from "./lib/cdp.mjs";

const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const ROUTES = (process.env.ROUTES || "/,/update,/bookmarks").split(",").map((route) => route.trim());
const LCP_BUDGET = Number(process.env.LCP_BUDGET_MS || 2500);
const CLS_BUDGET = Number(process.env.CLS_BUDGET || 0.1);
const LONG_TASK_BUDGET = Number(process.env.LONG_TASK_BUDGET_MS || 600);

const INIT = `(() => {
  window.__perf = { lcp: 0, cls: 0, longTasks: [] };
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__perf.lcp = Math.max(window.__perf.lcp, entry.startTime);
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__perf.cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__perf.longTasks.push(entry.duration);
    }).observe({ type: "longtask", buffered: true });
  } catch {}
})()`;

const READ = `(() => {
  const perf = window.__perf || { lcp: 0, cls: 0, longTasks: [] };
  const navigation = performance.getEntriesByType("navigation")[0];
  return {
    lcp: Math.round(perf.lcp),
    cls: Number(perf.cls.toFixed(4)),
    longTasks: perf.longTasks.length,
    longTaskTotal: Math.round(perf.longTasks.reduce((sum, value) => sum + value, 0)),
    domContentLoaded: Math.round(navigation ? navigation.domContentLoadedEventEnd : 0),
    loaded: Math.round(navigation ? navigation.loadEventEnd : 0),
  };
})()`;

async function main() {
  if (!findBrowser()) {
    console.log("⚠ perf-budget: no Chrome/Edge found — skipped (set BROWSER_PATH to enable).");
    return 0;
  }

  const { cdp, sessionId, cleanup } = await launchBrowser({ width: 1440, height: 900 });
  const failures = [];
  const routes = [...ROUTES];

  try {
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: INIT }, sessionId);

    try {
      await navigate(cdp, sessionId, `${BASE_URL}/`, { settleMs: 200 });
      const href = await evaluate(
        cdp,
        sessionId,
        `(() => { const a = document.querySelector('a[href^="/anime/"]'); return a ? a.getAttribute("href") : null; })()`,
      );
      if (href) routes.push(href);
    } catch {
      console.log("  ! could not discover a detail route; measuring the static list only");
    }

    console.log(
      `\nperf-budget — ${BASE_URL} (LCP ≤ ${LCP_BUDGET}ms, CLS ≤ ${CLS_BUDGET}, long tasks ≤ ${LONG_TASK_BUDGET}ms)`,
    );

    for (const route of routes) {
      try {
        await cdp.send("Page.reload", {}, sessionId).catch(() => {});
        await navigate(cdp, sessionId, `${BASE_URL}${route}`, { settleMs: 2000 });

        // Scroll through the page to trigger lazy content, then settle.
        await evaluate(
          cdp,
          sessionId,
          `(async () => {
            const step = window.innerHeight;
            for (let y = 0; y < document.body.scrollHeight; y += step) {
              window.scrollTo(0, y);
              await new Promise((resolve) => setTimeout(resolve, 120));
            }
            window.scrollTo(0, 0);
            return true;
          })()`,
          { awaitPromise: true },
        );
        await sleep(1200);

        const metrics = await evaluate(cdp, sessionId, READ);
        const problems = [];
        if (metrics.lcp > LCP_BUDGET) problems.push(`LCP ${metrics.lcp}ms > ${LCP_BUDGET}ms`);
        if (metrics.cls > CLS_BUDGET) problems.push(`CLS ${metrics.cls} > ${CLS_BUDGET}`);
        if (metrics.longTaskTotal > LONG_TASK_BUDGET)
          problems.push(`long tasks ${metrics.longTaskTotal}ms (${metrics.longTasks}) > ${LONG_TASK_BUDGET}ms`);
        const verdict = problems.length > 0 ? "×" : "✓";
        console.log(
          `  ${verdict} ${route}  LCP ${metrics.lcp}ms · CLS ${metrics.cls} · long tasks ${metrics.longTaskTotal}ms/${
            metrics.longTasks
          } · DCL ${metrics.domContentLoaded}ms · load ${metrics.loaded}ms`,
        );
        for (const problem of problems) {
          console.log(`      - ${problem}`);
          failures.push({ route, problem });
        }
      } catch (error) {
        failures.push({ route, problem: `navigation failed: ${String(error).slice(0, 160)}` });
        console.log(`  × ${route} — ${String(error).slice(0, 140)}`);
      }
    }
  } finally {
    cdp.close();
    cleanup();
    await sleep(200);
  }

  if (failures.length > 0) {
    console.error(`\n✗ perf-budget: ${failures.length} budget breach(es).`);
    process.exitCode = 1;
  } else {
    console.log(`\n✓ perf-budget: all ${routes.length} route(s) within budget.`);
  }
  return failures.length;
}

await main();
