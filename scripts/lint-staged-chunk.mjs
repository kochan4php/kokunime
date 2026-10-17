// Biome chokes on very long argv lists on Windows (git-staged 100+ files in
// one command). Batch the file list instead of one giant command line.
// Used by lint-staged via package.json.
import { spawnSync } from "node:child_process";

const files = process.argv.slice(2);
const BATCH_SIZE = 40;

for (let index = 0; index < files.length; index += BATCH_SIZE) {
  const batch = files.slice(index, index + BATCH_SIZE);
  const result = spawnSync("pnpm", ["exec", "biome", "check", "--write", "--no-errors-on-unmatched", ...batch], {
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
