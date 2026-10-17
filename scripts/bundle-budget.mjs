import fs from "fs";
import path from "path";

// CI bundle budget: parses the prerendered HTML for each static route, sums
// the client JS it actually references, and compares against the committed
// baseline. Also guards the total client-JS footprint. Fails when something
// grows more than THRESHOLD (default 10%). Refresh deliberately with --update.
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
    const srcs = new Set([...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+\.js)"/g)].map((match) => match[1]));
    let total = 0;
    for (const src of srcs) {
      total += statSize(path.join(".next", src.replace(/^\/_next\//, "")));
    }
    if (srcs.size > 0) routes[route || "/"] = total;
  }

  const totalClientJs = walk(path.join(".next", "static"))
    .filter((file) => file.endsWith(".js"))
    .reduce((sum, file) => sum + statSize(file), 0);

  return { routes, totalClientJs };
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

const report = (label, before, size) => {
  if (!before) return;
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

report("total client JS", baseline.totalClientJs, current.totalClientJs);
for (const [route, size] of Object.entries(current.routes)) {
  report(route, baseline.routes?.[route], size);
}

if (failed > 0) {
  console.error(
    `\n✗ ${failed} budget(s) grew more than ${THRESHOLD * 100}% — review the change or refresh the baseline intentionally.`,
  );
  process.exit(1);
}
console.log("✓ Bundle budget OK");
