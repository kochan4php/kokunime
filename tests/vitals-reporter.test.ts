import { afterEach, describe, expect, it, vi } from "vitest";
import { reportVitals } from "@/lib/vitals-reporter";

describe("vitals reporter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
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
});
