// Touch-target gate (WCAG 2.2 §2.5.8): every visible interactive control
// outside running text must be at least 24×24 CSS px. Inline links inside
// paragraphs borrow the text's target size and are exempt.
//
//   node scripts/touch-targets.mjs
//   BASE_URL=http://localhost:8000 MOBILE=1 node scripts/touch-targets.mjs
//
// Skips (exit 0) when no Chrome/Edge is installed.
import { evaluate, findBrowser, launchBrowser, navigate, sleep } from "./lib/cdp.mjs";

const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const MOBILE = process.env.MOBILE === "1";
const MIN = Number(process.env.TARGET_MIN || 24);
const ROUTES = (
  process.env.ROUTES || "/,/update,/seasons,/genres,/bookmarks,/stats,/wrapped,/compare,/roulette,/settings"
)
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);

const CHECK = `(() => {
  const MIN = ${MIN};
  const selector = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="tab"]';
  const offenders = [];
  for (const el of document.querySelectorAll(selector)) {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 1 || rect.height <= 1) continue; // sr-only / collapsed
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") continue;
    if (el.disabled) continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    if (rect.width >= MIN && rect.height >= MIN) continue;
    // Inline links inside running text borrow the text's target (exempt).
    if (el.tagName === "A" && style.display === "inline") continue;
    offenders.push({
      tag: el.tagName.toLowerCase(),
      size: Math.round(rect.width) + "×" + Math.round(rect.height),
      label: (el.getAttribute("aria-label") || el.getAttribute("title") || el.textContent || "")
        .trim()
        .replace(/\\s+/g, " ")
        .slice(0, 48),
      cls: String(el.className || "").slice(0, 70),
    });
  }
  // One report line per unique offender shape, with a count.
  const seen = new Map();
  for (const item of offenders) {
    const key = item.tag + "|" + item.size + "|" + item.cls;
    const entry = seen.get(key);
    if (entry) entry.count++;
    else seen.set(key, { ...item, count: 1 });
  }
  return JSON.stringify([...seen.values()]);
})()`;

async function main() {
  if (!findBrowser()) {
    console.log("⚠ touch-targets: no Chrome/Edge found — skipped (set BROWSER_PATH to enable).");
    return 0;
  }

  const { cdp, sessionId, cleanup } = await launchBrowser({
    width: MOBILE ? 390 : 1440,
    height: MOBILE ? 844 : 900,
    mobile: MOBILE,
  });
  const routes = [...ROUTES];
  const failures = [];

  try {
    await navigate(cdp, sessionId, `${BASE_URL}/`, { settleMs: 600 });
    const href = await evaluate(
      cdp,
      sessionId,
      `(() => { const a = document.querySelector('a[href^="/anime/"]'); return a ? a.getAttribute("href") : null; })()`,
    );
    if (href) routes.push(href);

    console.log(`\ntouch-targets — ${BASE_URL}${MOBILE ? " (mobile)" : ""} (min ${MIN}×${MIN} px)`);
    for (const route of routes) {
      try {
        await navigate(cdp, sessionId, `${BASE_URL}${route}`, { settleMs: 1200 });
        const offenders = JSON.parse((await evaluate(cdp, sessionId, CHECK)) || "[]");
        if (offenders.length === 0) {
          console.log(`  ✓ ${route}`);
          continue;
        }
        console.log(`  × ${route} — ${offenders.length} offender shape(s)`);
        for (const item of offenders) {
          console.log(`      ${item.size}  ${item.tag}  "${item.label}"  [${item.cls}]  ×${item.count}`);
        }
        failures.push(route);
      } catch (error) {
        failures.push(route);
        console.log(`  × ${route} — ${String(error).slice(0, 130)}`);
      }
    }
  } finally {
    cdp.close();
    cleanup();
    await sleep(200);
  }

  if (failures.length > 0) {
    console.error(`\n✗ touch-targets: ${failures.length} route(s) with sub-${MIN}px targets.`);
    process.exitCode = 1;
  } else {
    console.log(`\n✓ touch-targets: all ${routes.length} route(s) pass the ${MIN}px minimum.`);
  }
  return failures.length;
}

await main();
