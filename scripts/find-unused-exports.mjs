// Report-only: exports that nothing else in the repo references (dead code
// candidates). Heuristic, on purpose:
//   - framework entry points (route handlers, metadata, revalidate, ...) are skipped
//   - a name counts as "used" when it appears anywhere outside its own file
// Run: node scripts/find-unused-exports.mjs
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const SRC_DIRS = ["src"];
const SCAN_DIRS = ["src", "tests", "scripts"];

const SKIP_EXPORTS = new Set([
  "default",
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
  "metadata",
  "generateMetadata",
  "generateStaticParams",
  "generateImageMetadata",
  "revalidate",
  "dynamic",
  "dynamicParams",
  "fetchCache",
  "maxDuration",
  "preferredRegion",
  "runtime",
  "size",
  "contentType",
  "alt",
  "viewport",
  "config",
  "sitemap",
  "robots",
  "manifest",
  "experimental_ppr",
  "unstable_config",
]);

const walk = (dir, out = []) => {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) out.push(full);
  }
  return out;
};

const files = SRC_DIRS.flatMap((dir) => walk(path.join(ROOT, dir)));
const corpus = SCAN_DIRS.flatMap((dir) => walk(path.join(ROOT, dir)));

const textCache = new Map();
const readText = (file) => {
  if (!textCache.has(file)) textCache.set(file, fs.readFileSync(file, "utf8"));
  return textCache.get(file);
};

const EXPORT_RE = /^export\s+(?:async\s+)?(?:const|let|var|function|class|enum|interface|type)\s+([A-Za-z_$][\w$]*)/gm;
const NAMED_RE_EXPORT_RE = /^export\s*\{([^}]+)\}/gm;

const exportsByFile = new Map();
for (const file of files) {
  const text = readText(file);
  const names = new Set();
  for (const match of text.matchAll(EXPORT_RE)) names.add(match[1]);
  for (const match of text.matchAll(NAMED_RE_EXPORT_RE)) {
    for (const part of match[1].split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)
        .pop()
        ?.trim();
      if (name) names.add(name);
    }
  }
  exportsByFile.set(
    file,
    [...names].filter((name) => !SKIP_EXPORTS.has(name)),
  );
}

const unused = [];
for (const [file, names] of exportsByFile) {
  for (const name of names) {
    const wordRe = new RegExp(`\\b${name.replace(/\$/g, "\\$")}\\b`);
    const usedElsewhere = corpus.some((other) => other !== file && wordRe.test(readText(other)));
    if (!usedElsewhere) unused.push({ file: path.relative(ROOT, file), name });
  }
}

const totalExports = [...exportsByFile.values()].reduce((sum, names) => sum + names.length, 0);

if (unused.length === 0) {
  console.log(`✓ No unused exports found (${totalExports} exports scanned).`);
  process.exit(0);
}

console.log(`⚠ ${unused.length} possibly-unused export(s) out of ${totalExports} scanned:`);
for (const { file, name } of unused.sort((a, b) => a.file.localeCompare(b.file))) {
  console.log(`   ${file}: ${name}`);
}
console.log("\nHeuristic — dynamic string lookups and framework magic can false-positive.");
