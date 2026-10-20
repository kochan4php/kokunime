import { getCatalogSnapshot, parseCatalogPosts, parsePostSitemapImages } from "@/lib/catalog-snapshot";
import upstream from "@/config/upstream";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/redis", () => ({
  redisGet: vi.fn(async () => null),
  redisSet: vi.fn(async () => {}),
}));

describe("catalog snapshot parsing", () => {
  it("keeps real titles, dedupes slugs, and drops malformed posts", () => {
    const items = parseCatalogPosts([
      {
        slug: "one-piece",
        title: { rendered: "One Piece &#038; Friends" },
        modified_gmt: "2026-10-19T15:10:41",
      },
      { slug: "one-piece", title: { rendered: "Duplicate" }, modified_gmt: "2026-10-20T00:00:00" },
      { slug: "../admin", title: { rendered: "Bad" }, modified_gmt: "2026-10-19T15:10:41" },
      { slug: "no-title", title: { rendered: "  " }, modified_gmt: "2026-10-19T15:10:41" },
      { slug: "bad-date", title: { rendered: "Still Valid" }, modified_gmt: "not-a-date" },
    ]);

    expect(items).toEqual([
      {
        slug: "one-piece",
        title: "One Piece & Friends",
        modified: "2026-10-19T15:10:41.000Z",
      },
      { slug: "bad-date", title: "Still Valid", modified: "" },
    ]);
  });

  it("keeps underscore and percent-encoded Unicode slugs but rejects encoded separators", () => {
    const items = parseCatalogPosts([
      {
        slug: "ghost-in-the-shell-sac_2045-s2-batch-subtitle-indonesia-1",
        title: { rendered: "Ghost in the Shell" },
        modified_gmt: "2026-10-19T15:10:41",
      },
      {
        slug: "futari-wa-precure-splash%e2%98%86star-batch-subtitle-indonesia",
        title: { rendered: "Futari wa Precure" },
        modified_gmt: "2026-10-19T15:10:41",
      },
      {
        slug: "bad%2fencoded",
        title: { rendered: "Bad" },
        modified_gmt: "2026-10-19T15:10:41",
      },
    ]);

    expect(items.map((item) => item.slug)).toEqual([
      "ghost-in-the-shell-sac_2045-s2-batch-subtitle-indonesia-1",
      "futari-wa-precure-splash%e2%98%86star-batch-subtitle-indonesia",
    ]);
  });

  it("merges sitemap images by slug without inventing missing ones", () => {
    const images = parsePostSitemapImages(`
      <urlset>
        <url>
          <loc>https://kusonime.com/one-piece/</loc>
          <image:image><image:loc>https://kusonime.com/one-piece.jpg</image:loc></image:image>
        </url>
        <url><loc>https://kusonime.com/no-image/</loc></url>
      </urlset>
    `);
    const items = parseCatalogPosts(
      [
        { slug: "one-piece", title: { rendered: "One Piece" }, modified_gmt: "2026-10-19T15:10:41" },
        { slug: "no-image", title: { rendered: "No Image" }, modified_gmt: "2026-10-19T15:10:41" },
      ],
      images,
    );

    expect(items[0]).toMatchObject({ image: "https://kusonime.com/one-piece.jpg" });
    expect(items[1]).not.toHaveProperty("image");
  });

  it("shares one in-flight build across concurrent callers", async () => {
    let releaseBuild: (() => void) | undefined;
    const buildGate = new Promise<void>((resolve) => {
      releaseBuild = resolve;
    });
    const getJson = vi.spyOn(upstream, "getJson").mockImplementation(async () => {
      await buildGate;
      return {
        data: [
          {
            slug: "one-piece",
            title: { rendered: "One Piece" },
            modified_gmt: "2026-10-19T15:10:41",
          },
        ],
        headers: { "x-wp-total": "1", "x-wp-totalpages": "1" },
      };
    });
    vi.spyOn(upstream, "get").mockResolvedValue({
      data: "<urlset></urlset>",
      status: 200,
      headers: {},
      request: { responseURL: "https://kusonime.com/post-sitemap.xml" },
      config: { url: "https://kusonime.com/post-sitemap.xml" },
    });

    const first = getCatalogSnapshot();
    const second = getCatalogSnapshot();
    releaseBuild?.();
    const [a, b] = await Promise.all([first, second]);

    expect(getJson).toHaveBeenCalledTimes(1);
    expect(a?.items).toHaveLength(1);
    expect(b?.items).toHaveLength(1);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
