// Offline gate: saves an anime page, cuts the network inside Chrome, and
// checks the saved page (poster included) and the /offline list still render —
// service worker + CacheStorage end to end.
//
// The service worker only registers for a production build:
//   pnpm build && pnpm exec next start -p 8100
//   BASE_URL=http://localhost:8100 node scripts/offline-smoke.mjs
//
// Skips (exit 0) when no Chrome/Edge is installed.
import { evaluate, findBrowser, launchBrowser, navigate, sleep } from "./lib/cdp.mjs";

const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const checks = [];

const check = (name, ok, detail = "") => {
  checks.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};

// A challenged upstream spends its 10s timeout × retries on a cold render
// (~33s), which outlives the CDP command budget. Warm the URL out-of-band so
// the browser navigation itself stays fast, and fail with a clear reason when
// the page is not reachable at all.
const warmUp = async (url, label) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(75_000) }).catch(() => null);
  check(`${label} reachable`, Boolean(response?.ok), response ? `HTTP ${response.status}` : "timed out");
  return Boolean(response?.ok);
};

const setOffline = async (cdp, sessionId, offline) => {
  await cdp.send(
    "Network.emulateNetworkConditions",
    offline
      ? { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 }
      : { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 },
    sessionId,
  );
};

async function main() {
  if (!findBrowser()) {
    console.log("⚠ offline-smoke: no Chrome/Edge found — skipped (set BROWSER_PATH to enable).");
    return 0;
  }

  const { cdp, sessionId, cleanup } = await launchBrowser({ width: 1400, height: 900 });
  let ready = false;

  try {
    if (!(await warmUp(`${BASE_URL}/`, "home page"))) return 1;
    await navigate(cdp, sessionId, `${BASE_URL}/`, { settleMs: 1500 });
    const active = await evaluate(
      cdp,
      sessionId,
      `(async () => {
        try {
          const registration = await Promise.race([
            navigator.serviceWorker.ready,
            new Promise((resolve) => setTimeout(() => resolve(undefined), 10_000)),
          ]);
          return Boolean(registration && registration.active);
        } catch {
          return false;
        }
      })()`,
      { awaitPromise: true },
    );
    check("service worker active", active === true, active === true ? "" : "no worker (dev build or blocked origin?)");
    if (active !== true) return 1;

    // Reload so the document is served (and controlled) by the worker.
    await navigate(cdp, sessionId, `${BASE_URL}/`, { settleMs: 1500 });
    const controlled = await evaluate(cdp, sessionId, `Boolean(navigator.serviceWorker.controller)`);
    check("page controlled by the worker", controlled === true);

    const href = await evaluate(
      cdp,
      sessionId,
      `(() => {
        const link = [...document.querySelectorAll('a[href^="/anime/"]')].find((el) => !el.hash);
        return link ? link.getAttribute("href") : null;
      })()`,
    );
    if (!href) {
      check("detail link discovered", false, "home page had no plain /anime/ link");
      return 1;
    }

    if (!(await warmUp(`${BASE_URL}${href}`, "detail page"))) return 1;
    await navigate(cdp, sessionId, `${BASE_URL}${href}`, { settleMs: 2500 });
    const title = await evaluate(cdp, sessionId, `document.querySelector("main h1")?.textContent?.trim() || ""`);

    // The save flow reads the live poster URL, so wait for it to be usable.
    let posterWidth = 0;
    for (let attempt = 0; attempt < 20 && posterWidth === 0; attempt++) {
      posterWidth = Number(
        await evaluate(cdp, sessionId, `document.querySelector("[data-offline-image] img")?.naturalWidth || 0`),
      );
      if (posterWidth === 0) await sleep(400);
    }
    const posterAvailable = posterWidth > 0;
    if (posterAvailable) check("poster loaded before saving", true, `naturalWidth=${posterWidth}`);
    else console.log("WARN poster never loaded (upstream image unavailable) — poster checks skipped");

    await evaluate(cdp, sessionId, `document.querySelector("[data-offline-save]")?.click()`);
    let saved = false;
    for (let attempt = 0; attempt < 40 && !saved; attempt++) {
      saved =
        (await evaluate(
          cdp,
          sessionId,
          `document.querySelector("[data-offline-save]")?.getAttribute("aria-pressed") === "true"`,
        )) === true;
      if (!saved) await sleep(500);
    }
    check("page saved for offline", saved, saved ? href : "save button never reached aria-pressed=true");
    if (!saved) return 1;

    await setOffline(cdp, sessionId, true);
    ready = true;

    await navigate(cdp, sessionId, `${BASE_URL}${href}`, { settleMs: 2500 });
    const offlineTitle = await evaluate(cdp, sessionId, `document.querySelector("main h1")?.textContent?.trim() || ""`);
    const titleMatches = offlineTitle.length > 0 && (title.length === 0 || offlineTitle.includes(title.slice(0, 16)));
    check("saved page renders offline", titleMatches, offlineTitle.slice(0, 48) || "(empty heading)");

    const offlinePoster = Number(
      await evaluate(cdp, sessionId, `document.querySelector("[data-offline-image] img")?.naturalWidth || 0`),
    );
    if (posterAvailable) check("poster renders offline", offlinePoster > 0, `naturalWidth=${offlinePoster}`);

    await navigate(cdp, sessionId, `${BASE_URL}/offline`, { settleMs: 2000 });
    const listedHrefs = await evaluate(
      cdp,
      sessionId,
      `JSON.stringify([...document.querySelectorAll('a[href^="/anime/"]')].map((el) => el.getAttribute("href")))`,
    );
    const listed = String(listedHrefs).includes(href);
    check("/offline lists the saved entry", listed, listed ? "" : String(listedHrefs).slice(0, 120));

    // Corruption drill: drop the stored copy while still offline and prove the
    // app degrades to a usable page instead of a broken shell.
    const removed = await evaluate(
      cdp,
      sessionId,
      `(async () => {
        const cache = await caches.open("kokunime-saved");
        const keys = await cache.keys();
        const key = keys.find((request) => new URL(request.url).pathname === ${JSON.stringify(href)});
        return key ? await cache.delete(key) : false;
      })()`,
      { awaitPromise: true },
    );
    check("saved copy deleted (cache corruption drill)", removed === true);

    await navigate(cdp, sessionId, `${BASE_URL}${href}`, { settleMs: 2500 });
    const degraded = JSON.parse(
      await evaluate(
        cdp,
        sessionId,
        `JSON.stringify({ main: Boolean(document.querySelector("main")), text: (document.body.innerText || "").trim().length })`,
      ),
    );
    check(
      "page stays usable offline after the entry is gone",
      degraded.main === true && degraded.text > 100,
      `body text ${degraded.text} chars`,
    );

    await setOffline(cdp, sessionId, false);
    ready = false;

    // Back online: the new refresh message must answer through the worker
    // (same call the "Perbarui" button makes).
    const refreshOk = await evaluate(
      cdp,
      sessionId,
      `(async () => {
        const controller = navigator.serviceWorker.controller;
        if (!controller) return false;
        return await new Promise((resolve) => {
          const timer = setTimeout(() => resolve(false), 15_000);
          navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data?.type !== "kokunime:refresh-result") return;
            clearTimeout(timer);
            resolve(event.data.ok === true);
          });
          controller.postMessage({ type: "kokunime:refresh-offline", url: ${JSON.stringify(href)} });
        });
      })()`,
      { awaitPromise: true },
    );
    check("refresh-offline re-fetches the entry", refreshOk === true);

    const repaired = await evaluate(
      cdp,
      sessionId,
      `(async () => {
        const cache = await caches.open("kokunime-saved");
        const keys = await cache.keys();
        return keys.some((request) => new URL(request.url).pathname === ${JSON.stringify(href)});
      })()`,
      { awaitPromise: true },
    );
    check("refresh repairs the deleted cache entry", repaired === true);
  } finally {
    if (ready) await setOffline(cdp, sessionId, false).catch(() => {});
    cleanup();
    await sleep(200);
  }

  const failed = checks.filter((value) => !value).length;
  if (failed > 0) {
    console.error(`\n✗ offline-smoke: ${failed}/${checks.length} check(s) failed.`);
    process.exitCode = 1;
  } else {
    console.log(`\n✓ offline-smoke: all ${checks.length} checks passed.`);
  }
  return failed;
}

await main();
