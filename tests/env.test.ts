import { describe, expect, it } from "vitest";
import { validateEnv } from "@/config/env";

describe("env validation", () => {
  it("accepts an empty env (all vars optional)", () => {
    expect(validateEnv({})).toEqual([]);
  });

  it("accepts a healthy configuration", () => {
    expect(
      validateEnv({
        NEXT_PUBLIC_SITE_URL: "https://kokunime.example",
        REDIS_URL: "redis://localhost:6379",
        ERROR_WEBHOOK_URL: "https://discord.com/api/webhooks/1/abc",
        ADMIN_TOKEN: "0123456789abcdef",
        METRICS_TOKEN: "fedcba9876543210",
      }),
    ).toEqual([]);
  });

  it("flags a malformed site URL and redis scheme as errors", () => {
    const issues = validateEnv({ NEXT_PUBLIC_SITE_URL: "kokunime.example", REDIS_URL: "http://localhost:6379" });
    expect(issues).toHaveLength(2);
    expect(issues.every((issue) => issue.level === "error")).toBe(true);
    expect(issues.map((issue) => issue.key)).toEqual(["NEXT_PUBLIC_SITE_URL", "REDIS_URL"]);
  });

  it("warns on half a token pair and on short tokens", () => {
    const issues = validateEnv({ ADMIN_TOKEN: "short" });
    expect(issues).toEqual([
      expect.objectContaining({ level: "warn", key: "ADMIN_TOKEN/METRICS_TOKEN" }),
      expect.objectContaining({ level: "warn", key: "ADMIN_TOKEN" }),
    ]);
  });

  it("warns on a non-http webhook", () => {
    const issues = validateEnv({ ERROR_WEBHOOK_URL: "discord.com/hook" });
    expect(issues).toEqual([expect.objectContaining({ level: "warn", key: "ERROR_WEBHOOK_URL" })]);
  });
});
