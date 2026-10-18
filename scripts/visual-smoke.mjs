// Browser smoke gate: boots headless Chrome over CDP and checks every key
// route for a real render — non-blank content, no console errors, no
// horizontal overflow, no serious/critical axe violations. Screenshots of
// failures land in .smoke/.
//
//   node scripts/visual-smoke.mjs                     # http://localhost:3000
//   BASE_URL=http://localhost:8000 node scripts/visual-smoke.mjs
//   ROUTES=/,\/bookmarks MOBILE=1 AXE=off node scripts/visual-smoke.mjs
//
// Skips (exit 0) when no Chrome/Edge is installed — CI without a browser
// should not fail; CI with a browser gets the full gate.
import fs from "fs";
import path from "path";
import { evaluate, findBrowser, launchBrowser, navigate, runAxe, screenshot, sleep } from "./lib/cdp.mjs";

const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const MOBILE = process.env.MOBILE === "1";
const AXE_ON = (process.env.AXE || "on") !== "off";
const ROUTES = (
  process.env.ROUTES || "/,/update,/seasons,/genres,/bookmarks,/stats,/wrapped,/compare,/roulette,/settings"
)
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);

const NOISE = [
  "favicon",
  "Download the React DevTools",
  "ResizeObserver loop",
  "preload was ignored",
  "Speculation rules",
  "[Fast Refresh]",
  "web-vitals",
];

const isNoise = (text) => NOISE.some((needle) => text.includes(needle));

const checkExpression = `(() => {
  const doc = document.documentElement;
  const navigation = performance.getEntriesByType("navigation")[0];
  const text = (document.body && document.body.innerText) || "";
  const markers = ["Application error", "Internal Server Error", "Unhandled Runtime Error", "This page could not be found"];
  return {
    title: document.title,
    status: navigation && "responseStatus" in navigation ? navigation.responseStatus : null,
    textLength: text.trim().length,
    scrollWidth: doc.scrollWidth,
    clientWidth: doc.clientWidth,
    markers: markers.filter((marker) => text.includes(marker)),
  };
})()`;

async function main() {
  if (!findBrowser()) {
    console.log("⚠ visual-smoke: no Chrome/Edge found — skipped (set BROWSER_PATH to enable).");
    return 0;
  }

  const { cdp, sessionId, cleanup } = await launchBrowser({
    width: MOBILE ? 390 : 1440,
    height: MOBILE ? 844 : 900,
    mobile: MOBILE,
  });
  const failures = [];
  const shotDir = path.join(process.cwd(), ".smoke");
  const routes = [...ROUTES];

  try {
    // Discover one detail route from the home page so the check stays
    // data-agnostic (slug changes all the time).
    try {
      await navigate(cdp, sessionId, `${BASE_URL}/`);
      const href = await evaluate(
        cdp,
        sessionId,
        `(() => { const a = document.querySelector('a[href^="/anime/"]'); return a ? a.getAttribute("href") : null; })()`,
      );
      if (href) routes.push(href);
    } catch {
      failures.push({ route: "/ (discovery)", problems: ["could not load home to discover a detail route"] });
    }

    for (const route of routes) {
      const consoleErrors = [];
      const offConsole = cdp.on(sessionId, "Runtime.consoleAPICalled", (params) => {
        if (params.type !== "error") return;
        const text = (params.args || []).map((arg) => arg.value ?? arg.description ?? "").join(" ");
        if (text && !isNoise(text)) consoleErrors.push(text.slice(0, 200));
      });
      const offException = cdp.on(sessionId, "Runtime.exceptionThrown", (params) => {
        const text = params.exceptionDetails?.exception?.description || params.exceptionDetails?.text || "";
        if (text && !isNoise(text)) consoleErrors.push(String(text).slice(0, 200));
      });
      const offLog = cdp.on(sessionId, "Log.entryAdded", (params) => {
        if (params.entry?.level !== "error") return;
        const text = params.entry?.text || "";
        if (text && !isNoise(text)) consoleErrors.push(text.slice(0, 200));
      });

      let axeViolations = null;
      try {
        const { loaded } = await navigate(cdp, sessionId, `${BASE_URL}${route}`);
        const check = await evaluate(cdp, sessionId, checkExpression);
        if (AXE_ON) {
          // Entry animations make axe read half-faded text (false contrast
          // failures). Wait for finite animations to end; infinite ones are
          // cancelled so the snapshot sees settled colours.
          await evaluate(
            cdp,
            sessionId,
            `new Promise((resolve) => {
              const settle = () => {
                const pending = document.getAnimations().filter((a) => {
                  const timing = a.effect && a.effect.getTiming ? a.effect.getTiming() : null;
                  return a.playState === "running" && (!timing || timing.iterations !== Infinity);
                });
                if (pending.length === 0) return true;
                for (const a of document.getAnimations()) {
                  const timing = a.effect && a.effect.getTiming ? a.effect.getTiming() : null;
                  if (timing && timing.iterations === Infinity && a.playState === "running") a.cancel();
                }
                return false;
              };
              const started = performance.now();
              const tick = () => {
                if (settle() || performance.now() - started > 3000) resolve(true);
                else setTimeout(tick, 100);
              };
              tick();
            })`,
            { awaitPromise: true },
          );
          try {
            axeViolations = await runAxe(cdp, sessionId);
          } catch (error) {
            axeViolations = [{ id: "axe-run-error", impact: "serious", nodes: 0, help: String(error).slice(0, 160) }];
          }
        }

        const problems = [];
        if (!loaded) problems.push("page load event never fired");
        if (check.status && check.status >= 400) problems.push(`HTTP ${check.status}`);
        if (!check.title) problems.push("empty document title");
        if (check.textLength < 30) problems.push(`body nearly empty (${check.textLength} chars)`);
        if (check.scrollWidth > check.clientWidth + 1)
          problems.push(`horizontal overflow: scrollWidth ${check.scrollWidth} > clientWidth ${check.clientWidth}`);
        for (const marker of check.markers) problems.push(`error marker: "${marker}"`);
        for (const message of [...new Set(consoleErrors)].slice(0, 4)) problems.push(`console: ${message}`);
        for (const violation of axeViolations ?? []) {
          problems.push(`axe[${violation.impact}] ${violation.id} (${violation.nodes} nodes): ${violation.help}`);
          for (const sample of violation.samples ?? []) problems.push(`      ↳ ${sample}`);
        }
        if (axeViolations === null && AXE_ON) problems.push("axe injection failed silently");

        if (problems.length > 0) {
          failures.push({ route, problems });
          console.log(`  × ${route}`);
          for (const problem of problems) console.log(`      - ${problem}`);
          const shot = path.join(shotDir, `fail-${route.replace(/[^a-z0-9]+/gi, "_") || "home"}.png`);
          fs.mkdirSync(shotDir, { recursive: true });
          await screenshot(cdp, sessionId, shot).catch(() => {});
          console.log(`      ↳ screenshot: ${path.relative(process.cwd(), shot)}`);
        } else {
          console.log(`  ✓ ${route}`);
        }
      } catch (error) {
        failures.push({ route, problems: [`navigation failed: ${String(error).slice(0, 200)}`] });
        console.log(`  × ${route} — ${String(error).slice(0, 160)}`);
      } finally {
        offConsole();
        offException();
        offLog();
      }
    }
  } finally {
    cdp.close();
    cleanup();
    await sleep(200);
  }

  if (failures.length > 0) {
    console.error(`\n✗ visual-smoke: ${failures.length}/${routes.length} route(s) failed.`);
    process.exitCode = 1;
  } else {
    console.log(`\n✓ visual-smoke: ${routes.length} route(s) clean${MOBILE ? " (mobile 390px)" : ""}.`);
  }
  return failures.length;
}

await main();
