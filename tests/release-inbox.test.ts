// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
  getInboxReleases,
  getUnreadReleases,
  markReleaseRead,
  markReleasesRead,
  removeUnreadRelease,
  scanReleases,
} from "@/utils/release-inbox";
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

describe("inbox read history", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("markReleaseRead keeps the entry in the inbox but drops it from unread", () => {
    window.localStorage.setItem(STORAGE_KEYS.releaseUnread, JSON.stringify([ITEM]));

    markReleaseRead(ITEM.slug);

    expect(getUnreadReleases()).toEqual([]);
    expect(getInboxReleases()).toHaveLength(1);
    expect(getInboxReleases()[0]).toMatchObject({ slug: ITEM.slug, read: true });
  });

  it("markReleasesRead flags every entry and does not rewrite an all-read inbox", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.releaseUnread,
      JSON.stringify([ITEM, { ...ITEM, slug: "two-piece", title: "Two Piece" }]),
    );

    markReleasesRead();

    expect(getUnreadReleases()).toEqual([]);
    expect(getInboxReleases().every((item) => item.read)).toBe(true);

    const raw = window.localStorage.getItem(STORAGE_KEYS.releaseUnread);
    markReleasesRead();
    expect(window.localStorage.getItem(STORAGE_KEYS.releaseUnread)).toBe(raw);
  });

  it("a fresh release replaces the read history entry instead of duplicating it", () => {
    window.localStorage.setItem(STORAGE_KEYS.releaseUnread, JSON.stringify([{ ...ITEM, read: true }]));
    window.localStorage.setItem(STORAGE_KEYS.releaseSeen, JSON.stringify({ [ITEM.slug]: "Ep 2" }));

    const found = scanReleases([{ slug: ITEM.slug, title: ITEM.title, release: "Ep 3" }], [ITEM.slug]);

    expect(found).toBe(1);
    const inbox = getInboxReleases();
    expect(inbox).toHaveLength(1);
    expect(inbox[0]).toMatchObject({ slug: ITEM.slug, from: "Ep 2", to: "Ep 3" });
    expect(inbox[0]?.read).toBeUndefined();
    expect(getUnreadReleases()).toHaveLength(1);
  });
});
