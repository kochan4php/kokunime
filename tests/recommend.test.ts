import { describe, expect, it } from "vitest";
import { scoreRecommendations } from "@/lib/recommend";
import { Anime } from "@/interfaces";

const anime = (title: string, endpoint: string, genres: string[], release = "2024"): Anime => ({
  title,
  release,
  genres,
  link: { endpoint, image: `https://img.example/${title}.jpg` },
});

describe("scoreRecommendations", () => {
  it("ranks candidates by weighted genre overlap and excludes saved slugs", () => {
    const candidates = [
      anime("Action A", "/a-sub-indo", ["Action"]),
      anime("Action Fantasy B", "/b-sub-indo", ["Action", "Fantasy"]),
      anime("Fantasy C", "/c-sub-indo", ["Fantasy"]),
      anime("Comedy D", "/d-sub-indo", ["Comedy"]),
      anime("Saved", "/saved-sub-indo", ["Action", "Fantasy"]),
    ];

    const { items, topGenre } = scoreRecommendations(candidates, ["Action", "Fantasy", "Action"], ["saved-sub-indo"]);

    expect(topGenre).toBe("action");
    expect(items.map((item) => item.slug)).toEqual(["b-sub-indo", "a-sub-indo", "c-sub-indo"]);
    expect(items[0].score).toBe(3);
    expect(items.every((item) => item.slug !== "saved-sub-indo")).toBe(true);
    expect(items.every((item) => item.slug !== "d-sub-indo")).toBe(true);
  });

  it("returns nothing when no genre overlaps and respects the limit", () => {
    const candidates = [anime("Movie X", "/x-sub-indo", ["Horror"])];
    expect(scoreRecommendations(candidates, ["Action"], []).items).toEqual([]);

    const many = Array.from({ length: 5 }, (_, i) => anime(`A${i}`, `/a-${i}-sub-indo`, ["Action"]));
    expect(scoreRecommendations(many, ["Action"], [], 2).items).toHaveLength(2);
  });

  it("skips candidates without a usable endpoint", () => {
    const broken: Anime = { title: "No Link", release: "", genres: ["Action"], link: {} };
    const { items } = scoreRecommendations([broken], ["Action"], []);
    expect(items).toEqual([]);
  });
});
