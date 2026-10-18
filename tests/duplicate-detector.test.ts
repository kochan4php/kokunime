import { findDuplicateGroups, normalizeTitle } from "@/utils/duplicate-detector";
import { describe, expect, it } from "vitest";

describe("duplicate detector", () => {
  it("normalizes casing, punctuation and noise words", () => {
    expect(normalizeTitle("Jigoku Shoujo (Batch Sub Indo)")).toBe("jigoku shoujo");
    expect(normalizeTitle("JIGOKU   shoujo!")).toBe("jigoku shoujo");
    expect(normalizeTitle("Café  Ánime")).toBe("cafe anime");
  });

  it("keeps genuinely different titles apart", () => {
    expect(normalizeTitle("One Piece")).not.toBe(normalizeTitle("One Piece Film Red"));
    expect(normalizeTitle("Naruto")).not.toBe(normalizeTitle("Naruto Shippuden"));
  });

  it("groups titles that collapse to the same key", () => {
    const groups = findDuplicateGroups([
      { slug: "a", title: "Jigoku Shoujo" },
      { slug: "b", title: "Jigoku Shoujo Batch Sub Indo" },
      { slug: "c", title: "Other Anime" },
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.items.map((item) => item.slug)).toEqual(["a", "b"]);
  });

  it("returns no groups when titles are unique", () => {
    expect(findDuplicateGroups([{ title: "A" }, { title: "B" }])).toHaveLength(0);
  });
});
