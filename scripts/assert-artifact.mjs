// Asserts the production build artifact is shippable:
//  - a real build happened (.next/BUILD_ID + server + static)
//  - no public sourcemaps under .next/static
//  - productionBrowserSourceMaps is not enabled in next.config
//  - the build did not run with NODE_ENV=development
// Usage: node scripts/assert-artifact.mjs  (after `pnpm build`)
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const problems = [];

if (!existsSync(".next/BUILD_ID")) problems.push(".next/BUILD_ID missing — run `pnpm build` first");
for (const dir of [".next/server", ".next/static"]) {
  if (!existsSync(dir)) problems.push(`${dir} missing`);
}

const maps = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (entry.endsWith(".map")) maps.push(full);
  }
};
if (existsSync(".next/static")) walk(".next/static");
if (maps.length > 0) problems.push(`${maps.length} public sourcemap(s) under .next/static (first: ${maps[0]})`);

const config = readFileSync("next.config.mjs", "utf8");
if (/productionBrowserSourceMaps\s*:\s*true/.test(config)) {
  problems.push("productionBrowserSourceMaps is enabled — sourcemaps would ship publicly");
}

const requiredFiles = ".next/required-server-files.json";
if (existsSync(requiredFiles) && readFileSync(requiredFiles, "utf8").includes('"NODE_ENV":"development"')) {
  problems.push("build ran with NODE_ENV=development (required-server-files.json)");
}

if (problems.length > 0) {
  console.error(`✗ build artifact problems:\n- ${problems.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log("✓ build artifact sane (build id, no public sourcemaps, prod env)");
}
