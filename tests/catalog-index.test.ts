import { letterFromSlug, letterOf, letterSlug, resolveIndexPage } from "@/lib/catalog-index";
import { describe, expect, it } from "vitest";

describe("catalog index letters", () => {
  it("maps titles to their visible letter bucket", () => {
    expect(letterOf("One Piece")).toBe("O");
    expect(letterOf("  one piece")).toBe("O");
    expect(letterOf("Ångström")).toBe("#");
    expect(letterOf("")).toBe("#");
  });

  it("round-trips letter URL slugs and rejects arbitrary segments", () => {
    expect(letterSlug("A")).toBe("A");
    expect(letterSlug("#")).toBe("lain");
    expect(letterFromSlug("a")).toBe("A");
    expect(letterFromSlug("LAIN")).toBe("#");
    expect(letterFromSlug("AB")).toBeNull();
    expect(letterFromSlug("../a")).toBeNull();
  });

  it("clamps deep or malformed page requests to a real page and flags them", () => {
    expect(resolveIndexPage(undefined, 3)).toEqual({ page: 1, invalid: false });
    expect(resolveIndexPage("2", 3)).toEqual({ page: 2, invalid: false });
    expect(resolveIndexPage(["3"], 3)).toEqual({ page: 3, invalid: false });
    expect(resolveIndexPage("999", 3)).toEqual({ page: 3, invalid: true });
    expect(resolveIndexPage("0", 3)).toEqual({ page: 1, invalid: true });
    expect(resolveIndexPage("abc", 3)).toEqual({ page: 1, invalid: true });
  });
});
