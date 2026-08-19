import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  getBookmarks,
  isBookmarked,
  toggleBookmark,
  removeBookmark,
  clearAllBookmarks,
  parseMalXml,
  parseAniListJson,
  importBookmarksJson,
} from "@/utils/bookmarks";

describe("bookmarks utility", () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const mockStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
    vi.stubGlobal("localStorage", mockStorage);
    vi.stubGlobal("window", {
      localStorage: mockStorage,
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it("toggles bookmark state correctly", () => {
    const item = { slug: "naruto-shippuden", title: "Naruto Shippuden" };
    expect(isBookmarked("naruto-shippuden")).toBe(false);

    const added = toggleBookmark(item);
    expect(added).toBe(true);
    expect(isBookmarked("naruto-shippuden")).toBe(true);
    expect(getBookmarks()).toHaveLength(1);

    const removed = toggleBookmark(item);
    expect(removed).toBe(false);
    expect(isBookmarked("naruto-shippuden")).toBe(false);
  });

  it("removes bookmark by slug", () => {
    toggleBookmark({ slug: "one-piece", title: "One Piece" });
    toggleBookmark({ slug: "bleach", title: "Bleach" });
    expect(getBookmarks()).toHaveLength(2);

    removeBookmark("one-piece");
    expect(getBookmarks()).toHaveLength(1);
    expect(isBookmarked("one-piece")).toBe(false);
    expect(isBookmarked("bleach")).toBe(true);
  });

  it("clears all bookmarks", () => {
    toggleBookmark({ slug: "anime-1", title: "Anime 1" });
    toggleBookmark({ slug: "anime-2", title: "Anime 2" });
    expect(getBookmarks()).toHaveLength(2);

    clearAllBookmarks();
    expect(getBookmarks()).toHaveLength(0);
  });

  it("parses MyAnimeList XML export format correctly", () => {
    const malXml = `
      <myanimelist>
        <anime>
          <series_title><![CDATA[Frieren: Beyond Journey's End]]></series_title>
          <my_status>Watching</my_status>
          <my_score>10</my_score>
        </anime>
        <anime>
          <series_title>Demon Slayer Season 4</series_title>
          <my_status>Completed</my_status>
          <my_score>8</my_score>
        </anime>
      </myanimelist>
    `;

    const parsed = parseMalXml(malXml);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].title).toBe("Frieren: Beyond Journey's End");
    expect(parsed[0].status).toBe("watching");
    expect(parsed[0].rating).toBe(10);
    expect(parsed[1].title).toBe("Demon Slayer Season 4");
    expect(parsed[1].status).toBe("completed");
    expect(parsed[1].rating).toBe(8);
  });

  it("parses AniList JSON export format correctly", () => {
    const anilistJson = JSON.stringify([
      {
        media: {
          title: { english: "Solo Leveling", romaji: "Ore dake Level Up na Ken" },
          coverImage: { large: "https://example.com/solo.jpg" },
        },
        status: "CURRENT",
        score: 90,
      },
    ]);

    const parsed = parseAniListJson(anilistJson);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe("Solo Leveling");
    expect(parsed[0].status).toBe("watching");
    expect(parsed[0].rating).toBe(9);
    expect(parsed[0].image).toBe("https://example.com/solo.jpg");
  });

  it("imports MAL XML file into localStorage bookmarks cleanly", async () => {
    const malXml = `
      <myanimelist>
        <anime>
          <series_title>Jujutsu Kaisen</series_title>
          <my_status>Watching</my_status>
          <my_score>9</my_score>
        </anime>
      </myanimelist>
    `;

    const file = {
      name: "animelist.xml",
      text: () => Promise.resolve(malXml),
    } as unknown as File;

    const count = await importBookmarksJson(file);
    expect(count).toBe(1);
    expect(getBookmarks()).toHaveLength(1);
    expect(getBookmarks()[0].title).toBe("Jujutsu Kaisen");
  });
});
