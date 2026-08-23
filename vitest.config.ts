import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    // Hermetic: CI (Netlify) exports NODE_ENV=production, which would activate
    // the unstable_cache branch in services/cache.ts outside any Next request
    // context. Tests must always exercise the direct-execution path.
    env: {
      NODE_ENV: "test",
    },
    include: ["tests/**/*.test.ts"],
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
