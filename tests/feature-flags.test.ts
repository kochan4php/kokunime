import { beforeEach, describe, expect, it, vi } from "vitest";

const redisMock = vi.hoisted(() => ({
  configured: false,
  store: new Map<string, unknown>(),
}));

vi.mock("@/lib/redis", () => ({
  isRedisConfigured: () => redisMock.configured,
  redisGet: async (key: string) => redisMock.store.get(key) ?? null,
  redisSet: async (key: string, value: unknown) => {
    redisMock.store.set(key, value);
  },
}));

import { getFeatureFlags, isFeatureEnabled, setFeatureFlag } from "@/lib/feature-flags";

describe("feature flags", () => {
  beforeEach(() => {
    redisMock.configured = false;
    redisMock.store.clear();
  });

  it("falls back to defaults when nothing is stored", async () => {
    const flags = await getFeatureFlags();
    expect(flags.map((flag) => flag.key)).toEqual(["suggest", "report-vitals"]);
    expect(flags.every((flag) => flag.enabled)).toBe(true);
    expect(await isFeatureEnabled("suggest")).toBe(true);
  });

  it("toggles a flag in memory when Redis is off", async () => {
    expect(await setFeatureFlag("suggest", false)).toMatchObject({ key: "suggest", enabled: false });
    expect(await isFeatureEnabled("suggest")).toBe(false);
    expect(redisMock.store.size).toBe(0);
  });

  it("persists overrides through Redis when configured", async () => {
    redisMock.configured = true;
    await setFeatureFlag("report-vitals", false);
    expect(redisMock.store.size).toBe(1);
    expect((redisMock.store.get("feature-flags") as Record<string, boolean>)["report-vitals"]).toBe(false);
    expect(await isFeatureEnabled("report-vitals")).toBe(false);
  });

  it("rejects unknown flags without touching the store", async () => {
    expect(await setFeatureFlag("nope", true)).toBeNull();
    expect(await isFeatureEnabled("nope" as "suggest")).toBe(false);
  });
});
