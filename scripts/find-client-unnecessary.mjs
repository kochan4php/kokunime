import fs from "fs";
import path from "path";

// Report-only heuristic: components marked "use client" that never touch a
// hook, event handler, ref or browser-only React API could likely be server
// components (smaller client bundle). False positives are expected — review
// the list before changing any directive.
const ROOT = path.resolve("src");

const CLIENT_MARKERS =
  /\buse[A-Z][a-zA-Z]*\s*\(|\bon[A-Z][a-zA-Z]*\s*=|createPortal|flushSync|useSyncExternalStore|useOptimistic/;

const walk = (dir) => {
  const entries = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) entries.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) entries.push(full);
  }
  return entries;
};

const flagged = [];
for (const file of walk(ROOT)) {
  const source = fs.readFileSync(file, "utf8");
  const firstLine = source
    .split("\n")
    .find((line) => line.trim().length > 0)
    ?.trim();
  if (!/^["']use client["'];?$/.test(firstLine ?? "")) continue;

  const body = source.replace(/^["']use client["'];?\s*/, "");
  if (!CLIENT_MARKERS.test(body)) {
    flagged.push(path.relative(process.cwd(), file));
  }
}

if (flagged.length === 0) {
  console.log("✓ No suspicious client components found.");
} else {
  console.log(`${flagged.length} client component(s) without obvious client-only usage:`);
  for (const file of flagged) console.log(` - ${file}`);
}
process.exit(0);
