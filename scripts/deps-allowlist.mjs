// No new packages: package.json must match .deps-allowlist.json exactly.
// Adding or removing a dependency is a deliberate act — update the allowlist in
// the same commit so the change is visible in review.
import { readFileSync } from "node:fs";

const SECTIONS = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"];

const readJson = (path) => {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    console.error(`✗ deps-allowlist: cannot read ${path} (${error.message})`);
    process.exit(1);
  }
};

const pkg = readJson("package.json");
const allow = readJson(".deps-allowlist.json");
const problems = [];

for (const section of SECTIONS) {
  const actual = Object.keys(pkg[section] ?? {}).sort();
  const allowed = Object.keys(allow[section] ?? {}).sort();
  const added = actual.filter((name) => !allowed.includes(name));
  const removed = allowed.filter((name) => !actual.includes(name));
  if (added.length > 0) problems.push(`${section}: added ${added.join(", ")}`);
  if (removed.length > 0) problems.push(`${section}: removed ${removed.join(", ")}`);
}

if (problems.length > 0) {
  console.error("✗ deps-allowlist: package.json drifted from .deps-allowlist.json:");
  for (const problem of problems) console.error(`   ${problem}`);
  console.error("   The app ships without new packages: update .deps-allowlist.json only after a deliberate decision.");
  process.exit(1);
}
console.log("✓ dependency allowlist matches package.json.");
