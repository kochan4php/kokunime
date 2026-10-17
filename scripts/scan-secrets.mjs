// Regex secret scanner for the working tree (no dependencies).
// Usage: node scripts/scan-secrets.mjs
// Exit code 1 when a finding is reported. Add `secret-scan:ignore` on a line
// to allow a deliberate fixture.
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "backups",
  "graphify-out",
  "coverage",
  "dist",
  ".vercel",
  ".netlify",
]);
const SKIP_FILES = new Set(["pnpm-lock.yaml", "package-lock.json"]);
const SCAN_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".yml",
  ".yaml",
  ".md",
  ".toml",
  ".sh",
  ".css",
  ".html",
]);
const MAX_BYTES = 512 * 1024;

const PATTERNS = [
  { name: "AWS access key", regex: /AKIA[0-9A-Z]{16}/g },
  { name: "GitHub token", regex: /gh[pousr]_[A-Za-z0-9]{36,}/g },
  { name: "GitHub fine-grained PAT", regex: /github_pat_[A-Za-z0-9_]{22,}/g },
  { name: "Slack token", regex: /xox[baprs]-[A-Za-z0-9-]{10,}/g },
  { name: "Discord webhook", regex: /discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]{20,}/g },
  { name: "Private key block", regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g },
  { name: "Google API key", regex: /AIza[0-9A-Za-z_-]{35}/g },
  { name: "Stripe secret key", regex: /sk_live_[0-9a-zA-Z]{24,}/g },
  {
    name: "Generic secret assignment",
    regex: /(?:api[_-]?key|secret|password|passwd|access[_-]?token)\s*[:=]\s*["'][A-Za-z0-9+/_\-]{24,}["']/gi,
  },
];

const findings = [];
const pending = [process.cwd()];

const isScannable = (file) => {
  const base = path.basename(file);
  if (base.startsWith(".env") && !base.includes("example")) return true; // committed env file = fail
  return SCAN_EXTENSIONS.has(path.extname(file));
};

while (pending.length > 0) {
  const dir = pending.pop();
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(process.cwd(), full);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) pending.push(full);
      continue;
    }
    if (SKIP_FILES.has(entry.name) || !isScannable(full)) continue;
    try {
      if (statSync(full).size > MAX_BYTES) continue;
      const content = readFileSync(full, "utf8");
      const lines = content.split("\n");
      for (const { name, regex } of PATTERNS) {
        regex.lastIndex = 0;
        let match;
        while ((match = regex.exec(content)) !== null) {
          const lineNumber = content.slice(0, match.index).split("\n").length;
          if ((lines[lineNumber - 1] ?? "").includes("secret-scan:ignore")) continue;
          findings.push(`${rel}:${lineNumber} — ${name}`);
        }
      }
      if (path.basename(full).startsWith(".env") && !path.basename(full).includes("example")) {
        findings.push(`${rel} — committed env file`);
      }
    } catch {
      // Unreadable binary — skip.
    }
  }
}

if (findings.length === 0) {
  console.log("✓ no secrets found");
} else {
  console.error(`✗ ${findings.length} potential secret(s):`);
  for (const finding of findings) console.error(`  ${finding}`);
  process.exitCode = 1;
}
