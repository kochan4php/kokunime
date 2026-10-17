// Fails when a source file grows past the budget: smaller files are easier to
// review and safer to change. Prints the biggest files either way so creep is
// visible. Run: node scripts/file-size-budget.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = "src";
const LIMIT = 450; // lines per file

const walk = (dir) => {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
};

const files = walk(ROOT).map((file) => ({
  file,
  lines: readFileSync(file, "utf8").split("\n").length,
}));

const sorted = [...files].sort((a, b) => b.lines - a.lines);
const over = sorted.filter((entry) => entry.lines > LIMIT);

console.log(`File-size budget: ${LIMIT} lines (biggest files first):`);
for (const entry of sorted.slice(0, 10)) {
  console.log(`  ${entry.lines.toString().padStart(5)}  ${entry.file}`);
}

if (over.length > 0) {
  console.error(`\n✗ ${over.length} file(s) over the ${LIMIT}-line budget.`);
  process.exit(1);
}
console.log(`\n✓ All ${files.length} files within budget.`);
