import fs from "fs";
import path from "path";
import { countRequests, extractAssets } from "./lib/bundle-budget.mjs";

// CI bundle budget: parses the prerendered HTML for each static route, sums the
// network assets it references (JS, CSS, fonts, local images), and compares
// against the committed baseline. Requests count unique asset URLs, so adding
// a chunk, stylesheet, font, or image fails even when the byte total is flat.
// Remote images count as requests but have no local size. Dynamic routes have
// no build-time HTML; their runtime p75/p95 budgets live in the RUM view.
// Refresh deliberately with --update after reviewing the diff.
const BASELINE_FILE = "bundle-budget.json";
const THRESHOLD = Number(process.env.BUNDLE_BUDGET_THRESHOLD || 0.1);
const REPORT_DELTA = 0.05;

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const formatKb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const walk = (dir) => {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
};

const statSize = (file) => {
  try {
    return fs.statSync(file).size;
  } catch {
    return 0;
  }
};

// /_next/... lives in .next; /fonts/... and /images/... live in public.
// Query strings and remote URLs have no local file (remote images: size 0).
const localFile = (url) => {
  if (!url.startsWith("/") || url.startsWith("//")) return null;
  const clean = url.split("?")[0].split("#")[0];
  if (clean.startsWith("/_next/")) return path.join(".next", clean.slice("/_next/".length));
  return path.join("public", clean.replace(/^\//, ""));
};

const sumSize = (urls) =>
  urls.reduce((sum, url) => {
    const file = localFile(url);
    return sum + (file ? statSize(file) : 0);
  }, 0);

const collect = () => {
  const appDir = path.join(".next", "server", "app");
  if (!fs.existsSync(appDir)) {
    throw new Error(".next/server/app is missing — run `pnpm build` before the bundle budget.");
  }

  const routes = {};
  for (const htmlFile of walk(appDir).filter((file) => file.endsWith(".html"))) {
    const rel = path.relative(appDir, htmlFile).replace(/\\/g, "/");
    const route = `/${rel.replace(/\.html$/, "").replace(/(^|\/)index$/, "")}` || "/";
    const html = fs.readFileSync(htmlFile, "utf8");
    const assets = extractAssets(html);
    const requests = countRequests(assets);
    if (requests === 0) continue;
    routes[route || "/"] = {
      js: sumSize(assets.js),
      css: sumSize(assets.css),
      fonts: sumSize(assets.fonts),
      images: sumSize(assets.images),
      requests,
    };
  }

  const totalClientJs = walk(path.join(".next", "static"))
    .filter((file) => file.endsWith(".js"))
    .reduce((sum, file) => sum + statSize(file), 0);
  const totalCss = walk(path.join(".next", "static"))
    .filter((file) => file.endsWith(".css"))
    .reduce((sum, file) => sum + statSize(file), 0);

  return { routes, totalClientJs, totalCss };
};

const current = collect();

if (process.argv.includes("--update") || !fs.existsSync(BASELINE_FILE)) {
  fs.writeFileSync(
    BASELINE_FILE,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), ...current }, null, 2)}\n`,
  );
  console.log(`✓ Bundle baseline written to ${BASELINE_FILE} (${Object.keys(current.routes).length} routes)`);
  process.exit(0);
}

const baseline = readJson(BASELINE_FILE);
let failed = 0;

const reportBytes = (label, before, size) => {
  if (before === undefined) return;
  if (before === 0 && size === 0) return;
  if (before === 0) {
    failed++;
    console.error(`✗ ${label}: 0.0 KB → ${formatKb(size)} (new asset)`);
    return;
  }
  const delta = (size - before) / before;
  if (delta > THRESHOLD) {
    failed++;
    console.error(`✗ ${label}: ${formatKb(before)} → ${formatKb(size)} (${(delta * 100).toFixed(1)}%)`);
  } else if (Math.abs(delta) >= REPORT_DELTA) {
    console.log(
      ` ${delta > 0 ? "↗" : "↘"} ${label}: ${formatKb(before)} → ${formatKb(size)} (${(delta * 100).toFixed(1)}%)`,
    );
  }
};

const reportRequests = (label, before, count) => {
  if (before === undefined) return;
  if (before === 0 && count === 0) return;
  if (count > before * (1 + THRESHOLD)) {
    failed++;
    console.error(`✗ ${label}: ${before} → ${count} requests`);
  } else if (count !== before) {
    console.log(` ${count > before ? "↗" : "↘"} ${label}: ${before} → ${count} requests`);
  }
};

reportBytes("total client JS", baseline.totalClientJs, current.totalClientJs);
reportBytes("total CSS", baseline.totalCss, current.totalCss);

for (const route of Object.keys(baseline.routes ?? {})) {
  if (!current.routes[route]) console.warn(` ! ${route}: no prerendered HTML — budget skipped`);
}

for (const [route, metrics] of Object.entries(current.routes)) {
  const stored = baseline.routes?.[route];
  if (!stored) {
    failed++;
    console.error(`✗ ${route}: new route has no baseline — rerun with --update after review`);
    continue;
  }
  const before = typeof stored === "number" ? { js: stored } : stored;
  reportBytes(`${route} JS`, before.js, metrics.js);
  reportBytes(`${route} CSS`, before.css, metrics.css);
  reportBytes(`${route} fonts`, before.fonts, metrics.fonts);
  reportBytes(`${route} images`, before.images, metrics.images);
  reportRequests(`${route} requests`, before.requests, metrics.requests);
}

if (failed > 0) {
  console.error(`\n✗ ${failed} budget(s) exceeded — review the change or refresh the baseline intentionally.`);
  process.exit(1);
}
console.log("✓ Bundle budget OK");
