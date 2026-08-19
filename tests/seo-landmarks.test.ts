import { describe, expect, it } from "vitest";
import { buildAnimeJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";

describe("W3C HTML5 Semantic Landmarks & Structured Data Suite", () => {
  it("generates valid BreadcrumbList JSON-LD schema", () => {
    const json = buildBreadcrumbJsonLd("Solo Leveling Season 2", "solo-leveling-s2");
    expect(json["@context"]).toBe("https://schema.org");
    expect(json["@type"]).toBe("BreadcrumbList");
    expect((json.itemListElement as any[]).length).toBe(2);
    expect((json.itemListElement as any[])[0].name).toBe("Beranda");
    expect((json.itemListElement as any[])[1].name).toBe("Solo Leveling Season 2");
  });

  it("generates valid TVSeries / Movie JSON-LD schema with aggregate rating", () => {
    const json = buildAnimeJsonLd(
      {
        title: "Frieren: Beyond Journey's End",
        image: "https://example.com/frieren.jpg",
        synopsis: "Petualangan Frieren setelah mengalahkan raja iblis.",
        score: "9.3",
        genres: [{ name: "Adventure", endpoint: "adventure" }],
        season: { name: "Fall 2023", endpoint: "fall-2023" },
      } as any,
      "frieren-sub-indo",
    );

    expect(json["@context"]).toBe("https://schema.org");
    expect(json["@type"]).toBe("TVSeries");
    expect(json.name).toBe("Frieren: Beyond Journey's End");
    expect(json.aggregateRating).toBeDefined();
    expect((json.aggregateRating as any)?.ratingValue).toBe("9.3");
    expect((json.aggregateRating as any)?.bestRating).toBe("10");
  });

  it("generates valid FAQPage JSON-LD schema", () => {
    const json = buildFaqJsonLd({
      title: "Attack on Titan Final Season",
      release_on: "10 Januari 2022",
    } as any);

    expect(json["@context"]).toBe("https://schema.org");
    expect(json["@type"]).toBe("FAQPage");
    expect(Array.isArray(json.mainEntity)).toBe(true);
    expect((json.mainEntity as any[]).length).toBeGreaterThan(0);
    expect((json.mainEntity as any[])[0].name).toContain("Attack on Titan Final Season");
  });
});
