import { buildPaletteActions, isActionQuery } from "@/utils/palette-actions";
import { describe, expect, it } from "vitest";

describe("palette action mode", () => {
  it("only activates on a leading '>'", () => {
    expect(isActionQuery(">")).toBe(true);
    expect(isActionQuery(">update")).toBe(true);
    expect(isActionQuery("naruto")).toBe(false);
    expect(isActionQuery(" naruto")).toBe(false);
  });

  it("returns nothing outside action mode", () => {
    expect(buildPaletteActions("naruto")).toEqual([]);
    expect(buildPaletteActions("")).toEqual([]);
  });

  it("lists every shortcut for a bare '>'", () => {
    const actions = buildPaletteActions(">");
    expect(actions.length).toBeGreaterThan(5);
    expect(actions.map((action) => action.id)).toContain("bookmarks");
    expect(actions[0]?.href).toBe("/update");
  });

  it("pins the search fallback first and fuzzy-filters the rest", () => {
    const actions = buildPaletteActions(">book");
    expect(actions[0]?.id).toBe("search");
    expect(actions[0]?.href).toBe("/search/book");
    expect(actions.map((action) => action.id)).toContain("bookmarks");
    // Something unrelated to "book" must not appear.
    expect(actions.map((action) => action.id)).not.toContain("wrapped");
  });

  it("keeps only the search fallback when nothing matches", () => {
    const actions = buildPaletteActions(">zzzqqq");
    expect(actions).toHaveLength(1);
    expect(actions[0]?.href).toBe("/search/zzzqqq");
  });
});
