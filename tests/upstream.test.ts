import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import upstream from "@/config/upstream";
import { resetCircuits } from "@/lib/circuit-breaker";

vi.mock("@/lib/redis", () => ({
  redisGet: vi.fn(async () => null),
  redisSet: vi.fn(async () => {}),
}));

import { redisGet, redisSet } from "@/lib/redis";

const HTML = "<html><head><title>Kusonime</title></head><body>ok</body></html>";

describe("upstream fetch client", () => {
  beforeEach(() => {
    resetCircuits();
    vi.mocked(redisGet).mockResolvedValue(null);
    vi.mocked(redisSet).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("fetches html and sends the direct-scrape headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(HTML, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await upstream.get("/anime-test");
    expect(res.status).toBe(200);
    expect(res.data).toContain("Kusonime");

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://kusonime.com/anime-test");
    const headers = init.headers as Record<string, string>;
    expect(headers["User-Agent"]).toBe("*");
    expect(headers.Referer).toBe("https://kusonime.com/");
    expect(headers["X-Requested-With"]).toBe("XMLHttpRequest");
  });
});

describe("upstream failures", () => {
  beforeEach(() => {
    resetCircuits();
    vi.mocked(redisGet).mockResolvedValue(null);
    vi.mocked(redisSet).mockResolvedValue(undefined);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("retries transient network failures and succeeds on the third attempt", async () => {
    let calls = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        calls++;
        if (calls <= 2) throw new TypeError("fetch failed");
        return new Response(HTML, { status: 200 });
      }),
    );

    const promise = upstream.get("/anime/chaos-retry");
    await vi.runAllTimersAsync();
    const response = await promise;
    expect(response.status).toBe(200);
    expect(calls).toBe(3); // initial + MAX_RETRIES(2)
  });

  it("gives up after MAX_RETRIES and records the failure once", async () => {
    let calls = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        calls++;
        throw new TypeError("fetch failed");
      }),
    );

    const promise = upstream.get("/anime/always-down");
    const assertion = expect(promise).rejects.toThrow("fetch failed");
    await vi.runAllTimersAsync();
    await assertion;
    expect(calls).toBe(3); // no infinite retry loop
  });

  it("rejects responses without kusonime content (challenge/block pages)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("cloudflare challenge page", { status: 200 })),
    );

    const promise = upstream.get("/page/2/");
    const assertion = expect(promise).rejects.toThrow(/non-kusonime content/);
    await vi.runAllTimersAsync();
    await assertion;
  });
});

describe("upstream conditional GET", () => {
  beforeEach(() => {
    resetCircuits();
    vi.mocked(redisGet).mockResolvedValue(null);
    vi.mocked(redisSet).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("sends If-None-Match from the stored validator and serves the cached body on 304", async () => {
    vi.mocked(redisGet).mockImplementation(async (key: string) => {
      if (key.startsWith("upstream:body:")) return "<html><body>Kusonime cached</body></html>";
      if (key.startsWith("upstream:etag:")) return { etag: '"abc"', finalUrl: "https://kusonime.com/cached-page/" };
      return null;
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 304 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await upstream.get("/cached-page");
    expect(res.status).toBe(200);
    expect(res.data).toContain("Kusonime cached");
    expect(res.request.responseURL).toBe("https://kusonime.com/cached-page/");
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)["If-None-Match"]).toBe('"abc"');
  });

  it("serves cached JSON on 304 when the HTML brand check is disabled", async () => {
    vi.mocked(redisGet).mockImplementation(async (key: string) => {
      if (key.startsWith("upstream:body:")) return '{"ok":true}';
      if (key.startsWith("upstream:etag:")) return { etag: '"json"' };
      return null;
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 304 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await upstream.getJson<{ ok: boolean }>("/wp-json/wp/v2/posts");
    expect(res.data).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("stores validator + body after a 200 carrying an ETag", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("<html>Kusonime fresh</html>", { status: 200, headers: { etag: '"v2"' } }));
    vi.stubGlobal("fetch", fetchMock);

    await upstream.get("/fresh-page");
    expect(vi.mocked(redisSet)).toHaveBeenCalledWith(
      expect.stringMatching(/^upstream:body:/),
      expect.stringContaining("Kusonime fresh"),
      expect.any(Number),
    );
    expect(vi.mocked(redisSet)).toHaveBeenCalledWith(
      expect.stringMatching(/^upstream:etag:/),
      expect.objectContaining({ etag: '"v2"', finalUrl: "https://kusonime.com/fresh-page" }),
      expect.any(Number),
    );
  });
});
