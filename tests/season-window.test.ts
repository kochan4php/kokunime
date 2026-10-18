import { describe, expect, it } from "vitest";
import { getSeasonWindow, parseSeasonSlug, pickCurrentSeason } from "@/utils/season-window";

describe("season window", () => {
  it("parses known season slugs and rejects unknown ones", () => {
    expect(parseSeasonSlug("winter-2026")).toEqual({ season: "winter", year: 2026 });
    expect(parseSeasonSlug("fall-1999")).toEqual({ season: "fall", year: 1999 });
    expect(parseSeasonSlug("sping-2026")).toBeNull();
    expect(parseSeasonSlug("2026")).toBeNull();
    expect(parseSeasonSlug("winter-26")).toBeNull();
  });

  it("classifies upcoming, airing and ended seasons relative to now", () => {
    const now = new Date(2026, 9, 18); // 18 Oct 2026 (fall season)
    expect(getSeasonWindow("winter-2027", now)?.state).toBe("upcoming");
    expect(getSeasonWindow("fall-2026", now)?.state).toBe("airing");
    expect(getSeasonWindow("winter-2026", now)?.state).toBe("ended");
  });

  it("counts days until the window boundaries", () => {
    const now = new Date(2026, 9, 18); // 18 Oct 2026 — fall runs Oct-Dec
    const window = getSeasonWindow("fall-2026", now);
    expect(window?.daysUntilEnd).toBe(75); // 1 Jan 2027
    const upcoming = getSeasonWindow("winter-2027", now);
    expect(upcoming?.daysUntilStart).toBe(75); // 1 Jan 2027
  });

  it("returns null for unparseable slugs", () => {
    expect(getSeasonWindow("not-a-season")).toBeNull();
  });
});

describe("pickCurrentSeason", () => {
  const now = new Date(2026, 9, 18); // 18 Oct 2026 — fall 2026 is airing

  it("prefers the airing season", () => {
    const seasons = [{ name: "Spring 2026" }, { name: "Fall 2026" }, { name: "Winter 2026" }];
    expect(pickCurrentSeason(seasons, now)?.name).toBe("Fall 2026");
  });

  it("falls back to the most recently started season when nothing is airing", () => {
    const seasons = [{ name: "Winter 2026" }, { name: "Spring 2026" }, { name: "Summer 2026" }];
    expect(pickCurrentSeason(seasons, now)?.name).toBe("Summer 2026");
  });

  it("ignores unparseable and future-only entries", () => {
    expect(pickCurrentSeason([{ name: "2026" }, { name: "Winter 2027" }], now)).toBeNull();
    expect(pickCurrentSeason([], now)).toBeNull();
  });
});
