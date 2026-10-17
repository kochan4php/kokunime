// Semver tag from conventional commits.
//
//   node scripts/version-bump.mjs           # dry-run: hitung + tampilkan
//   node scripts/version-bump.mjs --write   # tulis package.json, commit, git tag
//
// Rules: "!"/"BREAKING CHANGE" → major; feat → minor; fix/perf/refactor/revert
// → patch; selain itu tidak memicu bump.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const sh = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

const lastTag = (() => {
  try {
    return sh("git describe --tags --abbrev=0");
  } catch {
    return "";
  }
})();

const range = lastTag ? `${lastTag}..HEAD` : "HEAD";
const subjects = sh(`git log --format=%s ${range}`)
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

if (subjects.length === 0) {
  console.log(`Tidak ada commit baru sejak ${lastTag || "awal riwayat"} — tidak ada yang di-tag.`);
  process.exit(0);
}

const breaking =
  subjects.some((subject) => /^[a-z]+(\([^)]+\))?!:/.test(subject)) ||
  /BREAKING CHANGE/.test(sh(`git log --format=%B ${range}`));
const bump = breaking
  ? "major"
  : subjects.some((subject) => /^feat(\([^)]+\))?:/.test(subject))
    ? "minor"
    : subjects.some((subject) => /^(fix|perf|refactor|revert)(\([^)]+\))?:/.test(subject))
      ? "patch"
      : null;

if (!bump) {
  console.log("Tidak ada commit feat/fix/perf/refactor/breaking — tidak ada bump versi.");
  process.exit(0);
}

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const [major, minor, patch] = pkg.version.split(".").map(Number);
const nextVersion =
  bump === "major"
    ? `${major + 1}.0.0`
    : bump === "minor"
      ? `${major}.${minor + 1}.0`
      : `${major}.${minor}.${patch + 1}`;

console.log(
  `Bump ${bump}: ${pkg.version} → ${nextVersion} (${subjects.length} commit sejak ${lastTag || "awal riwayat"})`,
);
for (const subject of subjects) console.log(`  • ${subject}`);

if (!process.argv.includes("--write")) {
  console.log("\nDry-run. Jalankan dengan --write untuk menulis package.json + membuat tag.");
  process.exit(0);
}

pkg.version = nextVersion;
writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
sh(`git add package.json`);
sh(`git commit -m "chore(release): v${nextVersion}"`);
sh(`git tag -a v${nextVersion} -m "v${nextVersion}"`);
console.log(`\n✓ Commit + tag v${nextVersion} dibuat. Push dengan: git push origin HEAD --tags`);
