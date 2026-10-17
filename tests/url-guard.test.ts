import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWithRedirectGuard, isPublicHttpUrl } from "@/lib/url-guard";

describe("url guard", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("rejects private, loopback, metadata and non-http hosts", () => {
    for (const bad of [
      "http://127.0.0.1/x",
      "http://10.0.0.5/",
      "http://192.168.1.1/",
      "http://169.254.169.254/latest/meta-data",
      "http://100.64.1.1/",
      "http://[::1]/",
      "http://[fd00::1]/",
      "http://localhost:3000",
      "http://foo.internal/",
      "ftp://example.com",
      "not a url",
    ]) {
      expect(isPublicHttpUrl(bad), bad).toBe(false);
    }
    expect(isPublicHttpUrl("https://discord.com/api/webhooks/1/2")).toBe(true);
    expect(isPublicHttpUrl("https://8.8.8.8/")).toBe(true);
  });

  it("blocks a public URL redirecting into a private IP", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 302, headers: { location: "http://127.0.0.1:6379/" } })),
    );
    await expect(fetchWithRedirectGuard("https://public.example/hook")).rejects.toThrow(/Blocked non-public URL/);
  });

  it("follows a safe redirect chain", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 302, headers: { location: "https://public.example/final" } }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await fetchWithRedirectGuard("https://public.example/start");
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
