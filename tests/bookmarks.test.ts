import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  getBookmarks,
  isBookmarked,
  toggleBookmark,
  removeBookmark,
  clearAllBookmarks,
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
});
