// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { getUnreadReleases, markReleasesRead, removeUnreadRelease, scanReleases } from "@/utils/release-inbox";
import { STORAGE_KEYS } from "@/utils/storage-keys";

// The bell feeds this store into useSyncExternalStore: the snapshot reference
// must stay stable while localStorage is unchanged, or React loops forever.
const ITEM = { slug: "one-piece", title: "One Piece", from: "Ep 1", to: "Ep 2", at: 1 };

describe("release inbox snapshot (useSyncExternalStore contract)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps one stable reference while storage is unchanged", () => {
    expect(getUnreadReleases()).toBe(getUnreadReleases());

    window.localStorage.setItem(STORAGE_KEYS.releaseUnread, JSON.stringify([ITEM]));
    const loaded = getUnreadReleases();
    expect(loaded).toEqual([ITEM]);
    expect(getUnreadReleases()).toBe(loaded);
  });

  it("returns a fresh reference only after a write", () => {
    window.localStorage.setItem(STORAGE_KEYS.releaseUnread, JSON.stringify([ITEM]));
    const before = getUnreadReleases();

    removeUnreadRelease(ITEM.slug);
    const after = getUnreadReleases();
    expect(after).toEqual([]);
    expect(after).not.toBe(before);
    expect(getUnreadReleases()).toBe(after);

    markReleasesRead(); // already empty: storage text unchanged, snapshot reused
    expect(getUnreadReleases()).toBe(after);
  });

  it("scanReleases publishes new arrivals without mutating the old snapshot", () => {
    scanReleases([{ slug: ITEM.slug, title: ITEM.title, release: "Ep 1" }], []);
    const primed = getUnreadReleases();

    const found = scanReleases([{ slug: ITEM.slug, title: ITEM.title, release: "Ep 2" }], [ITEM.slug]);
    expect(found).toBe(1);

    const unread = getUnreadReleases();
    expect(primed).toEqual([]);
    expect(unread).toHaveLength(1);
    expect(unread[0]).toMatchObject({ slug: ITEM.slug, from: "Ep 1", to: "Ep 2" });
  });
});
