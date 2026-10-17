import { describe, expect, it } from "vitest";
import { AnimeDetail } from "@/interfaces";
import { buildAnimeJsonLd, buildBreadcrumbJsonLd, buildItemListJsonLd, buildWebSiteJsonLd } from "@/lib/seo";

const baseAnime: AnimeDetail = {
  title: "Test Anime",
  type: "TV",
  total_episode: "12",
  score: "8.5",
  genre: [{ name: "Action" }, { name: "Comedy" }] as AnimeDetail["genre"],
  download: [],
};

describe("buildAnimeJsonLd", () => {
  it("emits TVSeries with episodes, rating and genre", () => {
    const jsonLd = buildAnimeJsonLd(baseAnime, "test-anime") as Record<string, unknown>;
    expect(jsonLd["@type"]).toBe("TVSeries");
    expect(jsonLd.numberOfEpisodes).toBe(12);
    expect((jsonLd.hasPart as unknown[]).length).toBe(12);
    expect((jsonLd.hasPart as Array<{ episodeNumber: number }>)[0]?.episodeNumber).toBe(1);
    expect(jsonLd.genre).toEqual(["Action", "Comedy"]);
    expect((jsonLd.aggregateRating as { ratingValue: string }).ratingValue).toBe("8.5");
  });

  it("caps the TVEpisode list at 50", () => {
    const jsonLd = buildAnimeJsonLd({ ...baseAnime, total_episode: "900" }, "long") as Record<string, unknown>;
    expect((jsonLd.hasPart as unknown[]).length).toBe(50);
  });

  it("uses Movie type and skips episode parts", () => {
    const jsonLd = buildAnimeJsonLd({ ...baseAnime, type: "Movie" }, "movie") as Record<string, unknown>;
    expect(jsonLd["@type"]).toBe("Movie");
    expect(jsonLd.hasPart).toBeUndefined();
  });
});

describe("buildWebSiteJsonLd / buildItemListJsonLd / buildBreadcrumbJsonLd", () => {
  it("WebSite carries the SearchAction template", () => {
    const jsonLd = buildWebSiteJsonLd() as { potentialAction: { target: { urlTemplate: string } } };
    expect(jsonLd.potentialAction.target.urlTemplate).toContain("/search/");
  });

  it("ItemList numbers entries from 1 and links detail pages", () => {
    const jsonLd = buildItemListJsonLd("Genre X", [
      { title: "A", slug: "a" },
      { title: "B", slug: "b" },
    ]) as { numberOfItems: number; itemListElement: Array<{ position: number; url: string }> };
    expect(jsonLd.numberOfItems).toBe(2);
    expect(jsonLd.itemListElement[0]?.position).toBe(1);
    expect(jsonLd.itemListElement[1]?.url).toContain("/anime/b");
  });

  it("Breadcrumb starts at Beranda", () => {
    const jsonLd = buildBreadcrumbJsonLd("T", "t") as { itemListElement: Array<{ name: string }> };
    expect(jsonLd.itemListElement[0]?.name).toBe("Beranda");
  });
});
