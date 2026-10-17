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

  it("records every sample into the p75 summary, webhook or not", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "");
    for (const value of [1000, 2000, 3000, 4000]) {
      await reportVitals({ name: "LCP", value, path: "/x" });
    }

    const rows = getVitalsSummary();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ name: "LCP", path: "/x", count: 4, p50: 2000, p75: 3000, max: 4000 });
  });

  it("sorts the summary by p75 descending", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "");
    await reportVitals({ name: "LCP", value: 1500, path: "/fast" });
    await reportVitals({ name: "LCP", value: 4200, path: "/slow" });

    expect(getVitalsSummary().map((row) => row.path)).toEqual(["/slow", "/fast"]);
  });
});
