import { afterEach, describe, expect, it, vi } from "vitest";
import { feedResponse, releaseDate } from "@/lib/feed-items";

describe("releaseDate", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("rounds to the hour so conditional requests see a byte-identical body", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-19T06:15:00Z"));
    const early = releaseDate("3 jam lalu");
    vi.setSystemTime(new Date("2026-10-19T06:59:59Z"));
    const late = releaseDate("3 jam lalu");

    expect(early.toISOString()).toBe("2026-10-19T03:00:00.000Z");
    expect(late.toISOString()).toBe(early.toISOString());
  });

  it("falls back to the current hour when the label is unreadable", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-19T06:15:00Z"));

    expect(releaseDate("tanpa tanggal").toISOString()).toBe("2026-10-19T06:00:00.000Z");
  });
});

describe("feedResponse", () => {
  const body = '<?xml version="1.0"?><rss></rss>';

  it("serves the body with an ETag and content type", () => {
    const response = feedResponse(new Request("http://localhost/feed.xml"), body, "application/xml");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/xml");
    expect(response.headers.get("etag")).toMatch(/^".+"$/);
  });

  it("answers 304 when If-None-Match matches", () => {
    const first = feedResponse(new Request("http://localhost/feed.xml"), body, "application/xml");
    const etag = first.headers.get("etag") ?? "";
    const second = feedResponse(
      new Request("http://localhost/feed.xml", { headers: { "If-None-Match": etag } }),
      body,
      "application/xml",
    );

    expect(second.status).toBe(304);
    expect(second.headers.get("etag")).toBe(etag);
  });

  it("serves 200 when the ETag no longer matches", () => {
    const response = feedResponse(
      new Request("http://localhost/feed.xml", { headers: { "If-None-Match": '"stale"' } }),
      body,
      "application/xml",
    );

    expect(response.status).toBe(200);
  });
});
