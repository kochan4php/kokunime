// Report-only: src modules whose basename never appears anywhere under
// tests/. Heuristic (indirect imports and framework entry points can
// false-positive), meant to spot want-to-have coverage, not to gate CI.
// Run: node scripts/find-untested.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const SRC = "src";
const TESTS = "tests";

const walk = (dir) => {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) files.push(full);
  }
  return files;
};

const testsBlob = walk(TESTS)
  .filter((file) => file.endsWith(".test.ts"))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

const modules = walk(SRC);
const untested = [];

for (const file of modules) {
  const base = path.basename(file).replace(/\.(tsx?|test)$/, "");
  if (base === "index" || base === "layout" || base === "page" || base === "route") continue;
  if (!testsBlob.includes(base)) {
    untested.push(path.relative(process.cwd(), file));
  }
}

console.log(`Modules without a test referencing them: ${untested.length}/${modules.length}`);
for (const file of untested) console.log(`  ${file}`);
console.log("\nHeuristic — indirect coverage (shared components, barrels) can false-positive.");
