import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getBookmarks,
  setFolderOrder,
  getFolderOrder,
  toggleBookmark,
  updateBookmarkUserMeta,
} from "@/utils/bookmarks";
import {
  addCollection,
  getCollections,
  mergeCollections,
  removeCollectionName,
  renameCollection,
} from "@/utils/collections";
import { STORAGE_KEYS } from "@/utils/storage-keys";

describe("custom collections registry", () => {
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

  it("adds, rejects duplicates, and rejects blank names", () => {
    expect(addCollection("Musim Gugur")).toBe("added");
    expect(addCollection("Musim Gugur")).toBe("exists");
    expect(addCollection("   ")).toBe("invalid");
    expect(getCollections()).toEqual(["Musim Gugur"]);
    expect(JSON.parse(store[STORAGE_KEYS.collections] ?? "[]")).toEqual(["Musim Gugur"]);
  });

  it("renames the registry entry, member bookmarks, and the order slot", () => {
    addCollection("Rewatch");
    addCollection("Selesai");
    setFolderOrder(["Selesai", "Rewatch"]);
    toggleBookmark({ slug: "a", title: "A" });
    toggleBookmark({ slug: "b", title: "B" });
    updateBookmarkUserMeta("a", { folder: "Rewatch" });

    expect(renameCollection("Rewatch", "Putar Ulang")).toBe("renamed");
    expect(getCollections()).toEqual(["Putar Ulang", "Selesai"]);
    expect(getBookmarks().find((item) => item.slug === "a")?.folder).toBe("Putar Ulang");
    expect(getFolderOrder()).toEqual(["Selesai", "Putar Ulang"]);
  });

  it("refuses a rename onto an existing name or a no-op", () => {
    addCollection("Alpha");
    addCollection("Beta");
    expect(renameCollection("Alpha", "Beta")).toBe("exists");
    expect(renameCollection("Alpha", "Alpha")).toBe("invalid");
    expect(renameCollection("Alpha", "")).toBe("invalid");
    expect(getCollections()).toEqual(["Alpha", "Beta"]);
  });

  it("renames bookmark-only folders (old data) and registers them", () => {
    toggleBookmark({ slug: "old", title: "Old" });
    updateBookmarkUserMeta("old", { folder: "Folder Lama" });

    expect(renameCollection("Folder Lama", "Folder Baru")).toBe("renamed");
    expect(getBookmarks()[0]?.folder).toBe("Folder Baru");
    expect(getCollections()).toEqual(["Folder Baru"]);
    expect(renameCollection("Tidak Ada", "X")).toBe("missing");
  });

  it("merges imports additively with sanitising", () => {
    addCollection("Satu");
    expect(mergeCollections(["Satu", "Dua", "  Dua  ", "", 7, null])).toBe(1);
    expect(getCollections()).toEqual(["Satu", "Dua"]);
    expect(mergeCollections("bukan-array")).toBe(0);
  });

  it("removes a name from the registry only", () => {
    addCollection("Hapus Aku");
    toggleBookmark({ slug: "c", title: "C" });
    updateBookmarkUserMeta("c", { folder: "Hapus Aku" });

    removeCollectionName("Hapus Aku");
    expect(getCollections()).toEqual([]);
    expect(getBookmarks()[0]?.folder).toBe("Hapus Aku");
  });
});
