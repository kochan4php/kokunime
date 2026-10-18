// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearCatalog, recordCatalogItems } from "@/utils/local-catalog";
import { getInboxReleases, markReleasesRead } from "@/utils/release-inbox";
import {
  checkSavedSearches,
  isSearchSaved,
  listSavedSearches,
  removeSavedSearch,
  saveSearch,
  toggleSavedSearch,
} from "@/utils/saved-searches";
import type { Anime } from "@/interfaces";

const item = (title: string, endpoint: string): Anime => ({
  title,
  release: "2002",
  genres: ["Action"],
  link: { endpoint, image: undefined },
});

beforeEach(() => {
  clearCatalog();
  window.localStorage.clear();
  window.dispatchEvent(new Event("storage"));
});

describe("saved searches", () => {
  it("saves, dedupes, lists and removes queries", () => {
    recordCatalogItems([item("Naruto", "/anime/naruto/")]);
    expect(saveSearch("naruto")?.query).toBe("naruto");
    expect(saveSearch("  NARUTO  ")).not.toBeNull();
    expect(listSavedSearches()).toHaveLength(1);
    expect(isSearchSaved("Naruto")).toBe(true);

    const id = listSavedSearches()[0]?.id as string;
    removeSavedSearch(id);
    expect(isSearchSaved("naruto")).toBe(false);
    expect(listSavedSearches()).toEqual([]);
  });

  it("toggles a query on and off", () => {
    recordCatalogItems([item("Naruto", "/anime/naruto/")]);
    expect(toggleSavedSearch("naruto")).toBe(true);
    expect(toggleSavedSearch("naruto")).toBe(false);
    expect(listSavedSearches()).toEqual([]);
  });

  it("seeds `seen` at save time so the current results do not flood the inbox", () => {
    recordCatalogItems([item("Naruto", "/anime/naruto/"), item("Naruto Shippuden", "/anime/naruto-shippuden/")]);
    saveSearch("naruto");
    expect(getInboxReleases()).toEqual([]);
    expect(checkSavedSearches()).toBe(0);
  });

  it("pushes only NEW matches into the inbox, once each", () => {
    recordCatalogItems([item("Naruto", "/anime/naruto/")]);
    saveSearch("naruto");

    recordCatalogItems([item("Naruto Shippuden", "/anime/naruto-shippuden/")]);
    expect(checkSavedSearches()).toBe(1);
    expect(checkSavedSearches()).toBe(0);

    const inbox = getInboxReleases();
    expect(inbox).toHaveLength(1);
    expect(inbox[0]?.kind).toBe("search");
    expect(inbox[0]?.title).toBe("Naruto Shippuden");
    expect(inbox[0]?.from).toBe("Pencarian tersimpan");
    expect(inbox[0]?.to).toBe("naruto");
  });

  it("does not stack a second entry for the same unread slug", () => {
    recordCatalogItems([item("Naruto", "/anime/naruto/")]);
    saveSearch("naruto");
    recordCatalogItems([item("Naruto Shippuden", "/anime/naruto-shippuden/")]);
    checkSavedSearches();
    // Read history keeps the item, but a repeat check must not duplicate it.
    markReleasesRead();
    expect(checkSavedSearches()).toBe(0);
    expect(getInboxReleases()).toHaveLength(1);
  });

  it("survives a reload", async () => {
    recordCatalogItems([item("Naruto", "/anime/naruto/")]);
    saveSearch("naruto");
    vi.resetModules();
    const fresh = await import("@/utils/saved-searches");
    expect(fresh.listSavedSearches().map((entry) => entry.query)).toEqual(["naruto"]);
  });
});
