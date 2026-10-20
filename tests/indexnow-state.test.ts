import { describe, expect, it } from "vitest";
import { diffSitemap, mergeSubmitted, parseSitemapEntries, parseSitemapLocs } from "../scripts/lib/indexnow-state.mjs";

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset>
  <url>
    <loc>https://example.com/anime/a?x=1&amp;y=2</loc>
    <lastmod>2026-10-19T00:00:00.000Z</lastmod>
  </url>
  <url><loc>https://example.com/genres/action</loc></url>
</urlset>`;

describe("indexnow state", () => {
  it("parses URL blocks with and without lastmod", () => {
    expect(parseSitemapEntries(xml)).toEqual([
      { url: "https://example.com/anime/a?x=1&y=2", lastmod: "2026-10-19T00:00:00.000Z" },
      { url: "https://example.com/genres/action", lastmod: "" },
    ]);
  });

  it("parses chunk locations from a sitemap index", () => {
    const index = `<sitemapindex><sitemap><loc>https://example.com/sitemaps/0.xml</loc></sitemap></sitemapindex>`;
    expect(parseSitemapLocs(index)).toEqual(["https://example.com/sitemaps/0.xml"]);
  });

  it("reports new and changed URLs only", () => {
    const entries = [
      { url: "https://example.com/a", lastmod: "2026-10-19" },
      { url: "https://example.com/b", lastmod: "2026-10-18" },
      { url: "https://example.com/c", lastmod: "" },
    ];
    const previous = { "https://example.com/b": "2026-10-17", "https://example.com/gone": "2026-01-01" };
    expect(diffSitemap(previous, entries)).toEqual({
      changed: ["https://example.com/a", "https://example.com/b", "https://example.com/c"],
      state: {
        "https://example.com/a": "2026-10-19",
        "https://example.com/b": "2026-10-18",
        "https://example.com/c": "",
      },
    });
  });

  it("submits nothing when nothing changed", () => {
    const entries = [{ url: "https://example.com/a", lastmod: "2026-10-19" }];
    const previous = { "https://example.com/a": "2026-10-19" };
    expect(diffSitemap(previous, entries).changed).toEqual([]);
  });

  it("retries failed batches without losing unchanged state", () => {
    const previous = { "https://example.com/a": "old", "https://example.com/b": "same" };
    const next = { "https://example.com/a": "new", "https://example.com/b": "same" };
    expect(mergeSubmitted(previous, next, new Set(["https://example.com/b"]))).toEqual({
      "https://example.com/b": "same",
    });
    expect(mergeSubmitted(previous, next, new Set(["https://example.com/a"]))).toEqual({
      "https://example.com/a": "new",
      "https://example.com/b": "same",
    });
  });
});
