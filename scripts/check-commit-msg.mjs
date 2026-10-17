// Conventional-commits gate for the commit-msg hook (no commitlint dep).
// Allowed: feat fix perf refactor docs test build ci chore style revert, with
// optional scope and "!". Merge/Revert commits and GitHub fixup/squash are
// exempt. Usage: node scripts/check-commit-msg.mjs <path-to-COMMIT_EDITMSG>
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/check-commit-msg.mjs <COMMIT_EDITMSG>");
  process.exit(2);
}

const subject = readFileSync(file, "utf8").split("\n")[0].trim();
const PATTERN = /^(feat|fix|perf|refactor|docs|test|build|ci|chore|style|revert)(\([a-z0-9._/-]+\))?!?: .{3,}/;

if (subject.startsWith("Merge ") || subject.startsWith("Revert ") || /^(fixup|squash)!/i.test(subject)) {
  process.exit(0);
}

if (!PATTERN.test(subject)) {
  console.error(`✗ Commit message must be conventional: <type>(<scope>)!: <subject>`);
  console.error(`  got: ${subject}`);
  console.error(`  types: feat fix perf refactor docs test build ci chore style revert`);
  process.exit(1);
}
