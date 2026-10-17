import { afterEach, describe, expect, it, vi } from "vitest";
import { reportError } from "@/lib/error-reporter";

describe("error reporter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("is a no-op when ERROR_WEBHOOK_URL is unset", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "");
    expect(await reportError({ source: "server", message: "boom-envless" })).toBe(false);
  });

  it("posts to the webhook and throttles duplicate fingerprints", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "https://discord.com/api/webhooks/123/abc");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    expect(await reportError({ source: "server", path: "/api/x", message: "unique-crash-1" })).toBe(true);
    expect(await reportError({ source: "server", path: "/api/x", message: "unique-crash-1" })).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(options.body)) as { embeds: { title: string }[] };
    expect(body.embeds[0]!.title).toBe("Kokunime Error");
  });

  it("attaches the suppressed count to the next report for the same fingerprint", async () => {
    vi.useFakeTimers();
    try {
      vi.stubEnv("ERROR_WEBHOOK_URL", "https://discord.com/api/webhooks/123/abc");
      const fetchMock = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal("fetch", fetchMock);

      expect(await reportError({ source: "server", path: "/api/y", message: "loop-crash" })).toBe(true);
      expect(await reportError({ source: "server", path: "/api/y", message: "loop-crash" })).toBe(false);
      expect(await reportError({ source: "server", path: "/api/y", message: "loop-crash" })).toBe(false);

      vi.advanceTimersByTime(10 * 60_000 + 1);
      expect(await reportError({ source: "server", path: "/api/y", message: "loop-crash" })).toBe(true);

      const [, options] = fetchMock.mock.calls[1] as [string, RequestInit];
      const body = JSON.parse(String(options.body)) as { embeds: { fields: { name: string; value: string }[] }[] };
      const suppressedField = body.embeds[0]!.fields.find((field) => field.name === "Suppressed");
      expect(suppressedField?.value).toContain("2x");
    } finally {
      vi.useRealTimers();
    }
  });
});
