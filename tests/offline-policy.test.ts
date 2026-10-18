import { describe, expect, it } from "vitest";
import { evictSavedEntries, isQuotaTight, type SavedOfflineEntry } from "@/utils/offline-saved";

const entry = (url: string, pinned = false): SavedOfflineEntry => ({ url, title: url, addedAt: 0, pinned });

describe("evictSavedEntries", () => {
  it("keeps the list untouched while under the cap", () => {
    const list = [entry("/a"), entry("/b")];
    const { keep, evicted } = evictSavedEntries(list, 3);
    expect(keep).toEqual(list);
    expect(evicted).toEqual([]);
  });

  it("drops the oldest unpinned entries (newest-first input)", () => {
    const list = ["/1", "/2", "/3", "/4", "/5"].map((url) => entry(url));
    const { keep, evicted } = evictSavedEntries(list, 3);
    expect(keep.map((item) => item.url)).toEqual(["/1", "/2", "/3"]);
    expect(evicted.map((item) => item.url)).toEqual(["/4", "/5"]);
  });

  it("protects a pin that sits behind unpinned entries", () => {
    const list = ["/1", "/2", "/3", "/4", "/5", "/6"].map((url) => entry(url));
    list[5] = entry("/6", true);
    const { keep, evicted } = evictSavedEntries(list, 3);
    expect(keep.map((item) => item.url)).toEqual(["/1", "/2", "/6"]);
    expect(evicted.map((item) => item.url)).toEqual(["/3", "/4", "/5"]);
  });

  it("never evicts pins, even when they exceed the cap on their own", () => {
    const list = [entry("/1", true), entry("/2", true), entry("/3"), entry("/4")];
    const { keep, evicted } = evictSavedEntries(list, 2);
    expect(keep.map((item) => item.url)).toEqual(["/1", "/2"]);
    expect(evicted.map((item) => item.url)).toEqual(["/3", "/4"]);
  });
});

describe("isQuotaTight", () => {
  it("warns from 80% usage upward", () => {
    expect(isQuotaTight(79, 100)).toBe(false);
    expect(isQuotaTight(80, 100)).toBe(true);
    expect(isQuotaTight(95, 100)).toBe(true);
  });

  it("does not warn when the quota is unknown", () => {
    expect(isQuotaTight(10, 0)).toBe(false);
  });
});
