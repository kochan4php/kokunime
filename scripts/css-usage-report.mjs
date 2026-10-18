// Report-only: class selectors defined in src/app/styles/*.css that never
// appear in src/**/*.{ts,tsx}. Warn-only (exit 0): dynamic class names can
// look unused, so this is a readability nudge, not a gate.
import fs from "fs";
import path from "path";

const STYLE_DIR = path.join(process.cwd(), "src", "app", "styles");
const SOURCE_DIR = path.join(process.cwd(), "src");

const walk = (dir, filter, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, filter, out);
    else if (filter(full)) out.push(full);
  }
  return out;
};

const cssFiles = fs.existsSync(STYLE_DIR) ? fs.readdirSync(STYLE_DIR).filter((file) => file.endsWith(".css")) : [];
const sourceFiles = walk(SOURCE_DIR, (file) => /\.(ts|tsx)$/.test(file));
const sourceText = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");

const defined = new Map(); // class -> css file
for (const file of cssFiles) {
  const css = fs.readFileSync(path.join(STYLE_DIR, file), "utf8");
  const withoutBlocks = css.replace(/@keyframes[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");
  for (const match of withoutBlocks.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
    const name = match[1];
    if (!defined.has(name)) defined.set(name, file);
  }
}

const unused = [...defined.entries()].filter(([name]) => !sourceText.includes(name));

console.log(`CSS usage report: ${defined.size} class selector(s) across ${cssFiles.length} stylesheet(s).`);
if (unused.length === 0) {
  console.log("✓ Every declared class appears somewhere in src/**/*.{ts,tsx}.");
} else {
  console.log(`⚠ ${unused.length} class selector(s) not found in TS/TSX (may be dynamic or dead):`);
  for (const [name, file] of unused.sort((a, b) => a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]))) {
    console.log(`  - .${name} (${file})`);
  }
}
