// License audit for direct production dependencies (no extra dependency).
// Usage: node scripts/check-licenses.mjs
import { readFileSync } from "node:fs";
import path from "node:path";

const ALLOWED = new Set([
  "MIT",
  "MIT-0",
  "ISC",
  "BSD",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "Apache-2.0",
  "0BSD",
  "Unlicense",
  "CC0-1.0",
  "MPL-2.0",
  "BlueOak-1.0.0",
  "Python-2.0",
  "Artistic-2.0",
  "CC-BY-4.0",
]);

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const deps = Object.keys(pkg.dependencies ?? {});
const problems = [];
const rows = [];

for (const dep of deps) {
  try {
    const depPkg = JSON.parse(readFileSync(path.join("node_modules", dep, "package.json"), "utf8"));
    const license =
      typeof depPkg.license === "string" ? depPkg.license : (depPkg.license?.type ?? depPkg.licenses?.[0]?.type ?? "");
    if (!license) problems.push(`${dep}: no license field`);
    else {
      const ok = [...ALLOWED].some((allowed) => license.includes(allowed));
      rows.push(`  ${ok ? "ok " : "!! "} ${dep}: ${license}`);
      if (!ok) problems.push(`${dep}: ${license}`);
    }
  } catch {
    problems.push(`${dep}: not installed (run pnpm install)`);
  }
}

console.log(`Direct production licenses (${deps.length}):`);
for (const row of rows) console.log(row);
if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} license problem(s):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exitCode = 1;
} else {
  console.log("\n✓ all direct production licenses allowed");
}
