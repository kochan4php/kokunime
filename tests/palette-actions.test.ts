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

  it("offers page-level copy/open actions", () => {
    const actions = buildPaletteActions(">");
    expect(actions.find((action) => action.id === "copy-url")?.kind).toBe("copy-url");
    expect(actions.find((action) => action.id === "open-url")?.kind).toBe("open-url");
    // Fuzzy filtering finds them by name too.
    expect(buildPaletteActions(">salin").map((action) => action.id)).toContain("copy-url");
  });

  it("adds a contextual copy-title action on detail pages", () => {
    const actions = buildPaletteActions(">", "/anime/naruto");
    expect(actions[0]?.id).toBe("copy-title");
    expect(actions[0]?.kind).toBe("copy-title");
  });

  it("exposes the keyboard cheat-sheet action", () => {
    expect(buildPaletteActions(">").find((action) => action.id === "shortcuts")?.kind).toBe("shortcuts");
  });
});
