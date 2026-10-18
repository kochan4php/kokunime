// Platform-only gate. The app must never load code, styles or fonts from a
// third-party origin at runtime (and never fetch fonts during the build).
//
// Allowed external origins are content-only: the scraper source and its image
// CDN — for <img>, connection hints and plain links. Anything executable
// (script/iframe/stylesheet/preload/font) from another origin is a failure.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = [".next/static", ".next/server/app", "public", "src"];
const SKIP_DIRS = new Set(["node_modules", ".git", ".next/cache"]);

// Content hosts (posters + outbound links) — fine for images and hints.
const CONTENT_HOSTS = ["kusonime.com", "wp.com"];
// The site's own origin (canonical/alternate links point at it absolutely).
const SELF_HOSTS = [
  (() => {
    try {
      return new URL(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://kokunime.netlify.app").host;
    } catch {
      return "kokunime.netlify.app";
    }
  })(),
  "localhost",
  "127.0.0.1",
];
// rel values that make the browser actually fetch something.
const RESOURCE_RELS = new Set([
  "stylesheet",
  "preload",
  "modulepreload",
  "prefetch",
  "preconnect",
  "dns-prefetch",
  "icon",
  "apple-touch-icon",
  "mask-icon",
  "manifest",
  "search",
]);
// Known third-party asset CDNs: never acceptable, in any file.
const BANNED =
  /(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com|esm\.sh|skypack\.dev|google-analytics\.com|googletagmanager\.com|cdn\.tailwindcss\.com)/i;

const ASSET_TAGS = /<(script|iframe)\b[^>]*\bsrc\s*=\s*["'](https?:\/\/[^"']+)["']/gi;
const LINK_TAGS = /<link\b[^>]*>/gi;
const CSS_URL = /url\(\s*["']?(https?:\/\/[^"')]+)/gi;
const CSS_IMPORT = /@import\s+(?:url\(\s*)?["']?(https?:\/\/[^"')]+)/gi;
const NEXT_FONT_GOOGLE = /next\/font\/google/;

const hostOf = (url) => {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
};
const isContentHost = (host) => CONTENT_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
const isSelfHost = (host) => SELF_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));

const findings = [];
const add = (file, line, reason, url) => findings.push({ file, line, reason, url });

const scanText = (file, text) => {
  const ext = extname(file).toLowerCase();
  const lineOf = (index) => text.slice(0, index).split("\n").length;

  if (NEXT_FONT_GOOGLE.test(text)) {
    add(file, lineOf(text.search(NEXT_FONT_GOOGLE)), "next/font/google (build-time third-party fetch)");
  }

  const banned = BANNED.exec(text);
  if (banned) add(file, lineOf(banned.index), "known third-party CDN", banned[0]);

  if (ext === ".css") {
    for (const match of text.matchAll(CSS_URL)) add(file, lineOf(match.index), "external url() in CSS", match[1]);
    for (const match of text.matchAll(CSS_IMPORT)) add(file, lineOf(match.index), "external @import in CSS", match[1]);
    return;
  }

  if (ext === ".html" || ext === ".rsc") {
    for (const match of text.matchAll(ASSET_TAGS)) {
      add(file, lineOf(match.index), `external <${match[1]} src>`, match[2]);
    }
    for (const match of text.matchAll(LINK_TAGS)) {
      const tag = match[0];
      const href = /\bhref\s*=\s*["'](https?:\/\/[^"']+)["']/i.exec(tag);
      if (!href) continue;
      const rel = (/\brel\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1] ?? "").toLowerCase().trim();
      const host = hostOf(href[1]);
      if (!RESOURCE_RELS.has(rel)) continue; // metadata links load nothing
      if (isSelfHost(host)) continue;
      if (isContentHost(host) && (rel === "preconnect" || rel === "dns-prefetch" || rel === "prefetch")) continue;
      add(file, lineOf(match.index), `external <link rel="${rel || "?"}">`, href[1]);
    }
    return;
  }

  if (ext === ".js" || ext === ".mjs" || ext === ".ts" || ext === ".tsx" || ext === ".json" || ext === ".xml") {
    // URLs in plain data/comments are fine; only the banned list above fails.
    return;
  }
};

const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(ROOT, full).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(rel) || SKIP_DIRS.has(entry.name)) continue;
      walk(full);
      continue;
    }
    if (!statSync(full).isFile()) continue;
    if (rel.startsWith(".next/dev")) continue;
    const ext = extname(entry.name).toLowerCase();
    if (![".css", ".html", ".rsc", ".js", ".mjs", ".json", ".xml", ".txt", ".ts", ".tsx"].includes(ext)) continue;
    if (entry.name.endsWith(".map")) continue;
    if (rel.startsWith(".next/server/app") && /\.(js|json)$/.test(rel) && !rel.endsWith(".rsc")) continue;
    if (ext === ".ts" || ext === ".tsx") {
      if (!rel.startsWith("src/")) continue;
    }
    scanText(rel, readFileSync(full, "utf8"));
  }
};

for (const dir of SCAN_DIRS) {
  try {
    statSync(dir);
  } catch {
    console.error(`no-third-party: ${dir} missing — run this after \`pnpm build\`.`);
    process.exit(1);
  }
  walk(dir);
}

if (findings.length > 0) {
  console.error(`✗ no-third-party: ${findings.length} third-party reference(s):`);
  for (const finding of findings.slice(0, 15)) {
    console.error(`   ${finding.file}:${finding.line} ${finding.reason} → ${finding.url ?? ""}`);
  }
  if (findings.length > 15) console.error(`   …and ${findings.length - 15} more`);
  process.exit(1);
}
console.log("✓ no third-party scripts, styles or fonts referenced anywhere in the build.");
