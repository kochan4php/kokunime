// Perf gate: measures LCP / CLS / INP / long tasks in real Chrome (CDP) against
// a running server and fails when a route blows its budget. Run against a
// production build (`pnpm build && pnpm start`) for meaningful numbers.
//
//   node scripts/perf-budget.mjs                    # http://localhost:3000
//   BASE_URL=http://localhost:8000 LCP_BUDGET_MS=3000 node scripts/perf-budget.mjs
//
// INP is sampled with a real trusted click on the palette trigger (Event
// Timing only records real input, not synthetic element.click()).
//
// Skips (exit 0) when no Chrome/Edge is installed.
import { evaluate, findBrowser, launchBrowser, navigate, sleep } from "./lib/cdp.mjs";

const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const ROUTES = (process.env.ROUTES || "/,/update,/bookmarks").split(",").map((route) => route.trim());
const LCP_BUDGET = Number(process.env.LCP_BUDGET_MS || 2500);
const CLS_BUDGET = Number(process.env.CLS_BUDGET || 0.1);
const INP_BUDGET = Number(process.env.INP_BUDGET_MS || 250);
const LONG_TASK_BUDGET = Number(process.env.LONG_TASK_BUDGET_MS || 600);

const INIT = `(() => {
  window.__perf = { lcp: 0, cls: 0, longTasks: [], events: [] };
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
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__perf.events.push(Math.round(entry.duration));
    }).observe({ type: "event", durationThreshold: 16, buffered: true });
  } catch {}
})()`;

const READ = `(() => {
  const perf = window.__perf || { lcp: 0, cls: 0, longTasks: [], events: [] };
  const navigation = performance.getEntriesByType("navigation")[0];
  return {
    lcp: Math.round(perf.lcp),
    cls: Number(perf.cls.toFixed(4)),
    inp: perf.events.length ? Math.max(...perf.events) : 0,
    events: perf.events.length,
    longTasks: perf.longTasks.length,
    longTaskTotal: Math.round(perf.longTasks.reduce((sum, value) => sum + value, 0)),
    domContentLoaded: Math.round(navigation ? navigation.domContentLoadedEventEnd : 0),
    loaded: Math.round(navigation ? navigation.loadEventEnd : 0),
  };
})()`;

// Trusted click + typing on the palette trigger: Event Timing only records
// real input, and only reports interactions whose duration reaches its 16ms
// floor — a page with no event entries is simply faster than that floor.
const measureInteraction = async (cdp, sessionId) => {
  const rect = await evaluate(
    cdp,
    sessionId,
    `(() => {
      // Two triggers exist (mobile + desktop); pick the one that is visible.
      const button = [...document.querySelectorAll('button[title*="Ctrl+K"]')].find(
        (el) => el.getBoundingClientRect().width > 0,
      );
      if (!button) return null;
      const box = button.getBoundingClientRect();
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    })()`,
  );
  if (!rect) return false;
  const point = { x: Math.round(rect.x), y: Math.round(rect.y) };
  await cdp.send(
    "Input.dispatchMouseEvent",
    { type: "mousePressed", ...point, button: "left", clickCount: 1 },
    sessionId,
  );
  await cdp.send(
    "Input.dispatchMouseEvent",
    { type: "mouseReleased", ...point, button: "left", clickCount: 1 },
    sessionId,
  );
  await sleep(250);
  // Type two letters: each keydown is a trusted interaction candidate.
  for (const [key, code] of [
    ["n", "KeyN"],
    ["a", "KeyA"],
  ]) {
    await cdp.send(
      "Input.dispatchKeyEvent",
      { type: "keyDown", key, code, text: key, windowsVirtualKeyCode: key.toUpperCase().charCodeAt(0) },
      sessionId,
    );
    await cdp.send(
      "Input.dispatchKeyEvent",
      { type: "keyUp", key, code, windowsVirtualKeyCode: key.toUpperCase().charCodeAt(0) },
      sessionId,
    );
    await sleep(80);
  }
  await cdp.send(
    "Input.dispatchKeyEvent",
    { type: "rawKeyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 },
    sessionId,
  );
  await cdp.send(
    "Input.dispatchKeyEvent",
    { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 },
    sessionId,
  );
  await sleep(400);
  return true;
};

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

    // Discovery can miss while the home page is still cold (upstream slow), so
    // it is retried after the warm pass below.
    const discoverDetail = async () => {
      await navigate(cdp, sessionId, `${BASE_URL}/`, { settleMs: 800 });
      const href = await evaluate(
        cdp,
        sessionId,
        `(() => { const a = document.querySelector('a[href^="/anime/"]'); return a ? a.getAttribute("href") : null; })()`,
      );
      return href ?? null;
    };

    let href = null;
    try {
      href = await discoverDetail();
    } catch {
      console.log("  ! could not load the home page for detail discovery");
    }
    if (href) routes.push(href);

    console.log(
      `\nperf-budget — ${BASE_URL} (LCP ≤ ${LCP_BUDGET}ms, CLS ≤ ${CLS_BUDGET}, INP ≤ ${INP_BUDGET}ms, long tasks ≤ ${LONG_TASK_BUDGET}ms)`,
    );

    // Warm pass: dynamic routes hit a slow upstream on their first render
    // (kusonime regularly answers in 5–10s). The budgets describe the warm
    // steady state, so every route is visited once before it is measured.
    console.log("  (warming routes…)");
    for (const route of routes) {
      await navigate(cdp, sessionId, `${BASE_URL}${route}`, { settleMs: 1200 }).catch(() => {});
    }

    if (!href) {
      const retry = await discoverDetail().catch(() => null);
      if (retry) {
        routes.push(retry);
        await navigate(cdp, sessionId, `${BASE_URL}${retry}`, { settleMs: 1500 }).catch(() => {});
      } else {
        console.log("  ! no detail route discovered; measuring the static list only");
      }
    }

    const measureRoute = async (route) => {
      await cdp.send("Page.reload", {}, sessionId).catch(() => {});
      await navigate(cdp, sessionId, `${BASE_URL}${route}`, { settleMs: 2000 });

      // Real interaction for INP, before the scroll-through.
      await measureInteraction(cdp, sessionId);

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
      if (metrics.events > 0 && metrics.inp > INP_BUDGET) problems.push(`INP ${metrics.inp}ms > ${INP_BUDGET}ms`);
      if (metrics.longTaskTotal > LONG_TASK_BUDGET)
        problems.push(`long tasks ${metrics.longTaskTotal}ms (${metrics.longTasks}) > ${LONG_TASK_BUDGET}ms`);
      return { metrics, problems };
    };

    for (const route of routes) {
      try {
        let { metrics, problems } = await measureRoute(route);
        let retried = false;
        // A first document that took over 1.5s to arrive is an upstream cold
        // render, not a UI regression: re-measure once while it is warm.
        if (problems.length > 0 && metrics.domContentLoaded > 1500) {
          retried = true;
          ({ metrics, problems } = await measureRoute(route));
        }
        const verdict = problems.length > 0 ? "×" : "✓";
        const inpLabel = metrics.events > 0 ? `INP ${metrics.inp}ms/${metrics.events}` : "INP <16ms";
        console.log(
          `  ${verdict} ${route}  LCP ${metrics.lcp}ms · CLS ${metrics.cls} · ${inpLabel} · long tasks ${
            metrics.longTaskTotal
          }ms/${metrics.longTasks} · DCL ${metrics.domContentLoaded}ms · load ${metrics.loaded}ms${
            retried ? "  (measured twice)" : ""
          }`,
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
