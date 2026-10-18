import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// jsdom tests also declare `// @vitest-environment jsdom` inline; listing them
// here keeps the split explicit even if the pragmas are ever dropped.
const DOM_TESTS = [
  "tests/a11y.test.ts",
  "tests/download-anchors.test.ts",
  "tests/honeypot-a11y.test.ts",
  "tests/interactions.test.ts",
  "tests/release-inbox.test.ts",
];

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Hermetic: CI (Netlify) exports NODE_ENV=production, which would activate
    // the unstable_cache branch in services/cache.ts outside any Next request
    // context. Tests must always exercise the direct-execution path.
    env: {
      NODE_ENV: "test",
    },
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["tests/**/*.test.ts"],
          exclude: DOM_TESTS,
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "jsdom",
          include: DOM_TESTS,
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
});
