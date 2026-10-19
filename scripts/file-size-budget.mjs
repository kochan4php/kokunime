// Fails when a code file grows past its budget: smaller files are easier to
// review and safer to change. The src TS/TSX limit stays at 450; every other
// code file (scripts, tests, CSS, public workers) must stay at or below 500.
// Run: node scripts/file-size-budget.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = ".";
const SRC_LIMIT = 450; // lines per src/**/*.ts(x)
const CODE_LIMIT = 500; // lines per every other tracked code file
const IGNORED_DIRS = new Set([
  ".git",
  ".next",
  ".turbo",
  ".cache",
  "node_modules",
  "graphify-out",
  "coverage",
  "dist",
  "build",
  "test-results",
  "playwright-report",
]);
const CODE_FILE = /\.(tsx?|jsx?|mjs|cjs|css)$/;

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    if (IGNORED_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (CODE_FILE.test(entry)) out.push(full);
  }
  return out;
};

const limitFor = (file) => (file.startsWith(`src${path.sep}`) && /\.tsx?$/.test(file) ? SRC_LIMIT : CODE_LIMIT);

const files = walk(ROOT).map((file) => ({
  file,
  lines: readFileSync(file, "utf8").split("\n").length,
  limit: limitFor(file),
}));

const sorted = [...files].sort((a, b) => b.lines - a.lines);
const over = sorted.filter((entry) => entry.lines > entry.limit);

console.log(`File-size budget: ${SRC_LIMIT} lines for src TS/TSX, ${CODE_LIMIT} for other code.`);
for (const entry of sorted.slice(0, 10)) {
  console.log(`  ${entry.lines.toString().padStart(5)}  ${entry.file}`);
}

if (over.length > 0) {
  console.error(`\n✗ ${over.length} file(s) over budget:`);
  for (const entry of over) console.error(`  ${entry.lines} > ${entry.limit}  ${entry.file}`);
  process.exit(1);
}
console.log(`\n✓ All ${files.length} code files within budget.`);
