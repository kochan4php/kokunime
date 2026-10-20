import { afterEach, describe, expect, it, vi } from "vitest";
import { getVitalsSummary, reportVitals, resetVitalsSamples } from "@/lib/vitals-reporter";

describe("vitals reporter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    resetVitalsSamples();
  });

  it("is a no-op when ERROR_WEBHOOK_URL is unset", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "");
    expect(await reportVitals({ name: "LCP", value: 9000, path: "/x" })).toBe(false);
  });

  it("ignores values within the good threshold", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "https://discord.com/api/webhooks/123/abc");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    expect(await reportVitals({ name: "LCP", value: 1200, path: "/fast" })).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts poor values and throttles the same metric+path", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "https://discord.com/api/webhooks/123/abc");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    expect(await reportVitals({ name: "LCP", value: 5000, path: "/slow-unique-1", deviceType: "mobile" })).toBe(true);
    expect(await reportVitals({ name: "LCP", value: 5200, path: "/slow-unique-1" })).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shares the ring buffer across separately-loaded module copies", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "");
    const first = await import("@/lib/vitals-reporter");
    await first.reportVitals({ name: "INP", value: 150, path: "/shared" });

    vi.resetModules();
    const second = await import("@/lib/vitals-reporter");
    expect(second.getVitalsSummary().map((row) => row.path)).toEqual(["/shared"]);
  });

  it("keeps device and connection counts inside the same sample window", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "");
    for (let i = 0; i < 201; i += 1) {
      await reportVitals({
        name: "LCP",
        value: i,
        path: "/window",
        deviceType: i % 2 === 0 ? "mobile" : "desktop",
        connection: "4g",
      });
    }

    const [row] = getVitalsSummary();
    expect(row?.count).toBe(200);
    expect(Object.values(row?.devices ?? {}).reduce((sum, count) => sum + count, 0)).toBe(200);
    expect(row?.connections).toEqual({ "4g": 200 });
  });

  it("records every sample into the percentile summary, webhook or not", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "");
    for (const value of [1000, 2000, 3000, 4000]) {
      await reportVitals({ name: "LCP", value, path: "/x" });
    }

    const rows = getVitalsSummary();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      name: "LCP",
      path: "/x",
      count: 4,
      p50: 2000,
      p75: 3000,
      p95: 4000,
      max: 4000,
    });
  });

  it("counts device and connection dimensions per route", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "");
    await reportVitals({ name: "INP", value: 120, path: "/x", deviceType: "mobile", connection: "3g" });
    await reportVitals({ name: "INP", value: 220, path: "/x", deviceType: "desktop", connection: "4g" });
    await reportVitals({ name: "INP", value: 320, path: "/x", deviceType: "mobile", connection: "4g" });

    const [row] = getVitalsSummary();
    expect(row).toMatchObject({
      count: 3,
      p75: 320,
      p95: 320,
      devices: { mobile: 2, desktop: 1 },
      connections: { "3g": 1, "4g": 2 },
    });
  });

  it("sorts the summary by p75 descending", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "");
    await reportVitals({ name: "LCP", value: 1500, path: "/fast" });
    await reportVitals({ name: "LCP", value: 4200, path: "/slow" });

    expect(getVitalsSummary().map((row) => row.path)).toEqual(["/slow", "/fast"]);
  });
});
