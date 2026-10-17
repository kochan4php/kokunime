"use client";

import { STORAGE_KEYS } from "@/utils/storage-keys";

export interface UnreadRelease {
  slug: string;
  title: string;
  from: string;
  to: string;
  at: number;
}

export interface ReleaseItem {
  slug: string | null;
  title: string;
  release?: string;
}

const SEEN_KEY = STORAGE_KEYS.releaseSeen;
const UNREAD_KEY = STORAGE_KEYS.releaseUnread;
const EVENT_NAME = "kokunime:release-inbox";
const MAX_SEEN = 400;
const MAX_UNREAD = 50;

const getStorage = () => (typeof window !== "undefined" ? window.localStorage : null);

const getReleaseSeen = (): Record<string, string> => {
  const storage = getStorage();
  if (!storage) return {};
  try {
    const raw = storage.getItem(SEEN_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const getUnreadReleases = (): UnreadRelease[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(UNREAD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UnreadRelease[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (key: string, value: unknown): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // Quota exceeded — the inbox silently stays as it was.
  }
};

// Compares the release labels of the given listing against the last-seen map.
// A changed label on a BOOKMARKED slug (e.g. "Released on 3:00 pm" → a fresh
// episode marker) lands in the inbox; first sightings only prime the map.
export const scanReleases = (items: ReleaseItem[], bookmarkedSlugs: string[]): number => {
  const storage = getStorage();
  if (!storage || items.length === 0) return 0;

  const seen = getReleaseSeen();
  const unread = getUnreadReleases();
  const bookmarked = new Set(bookmarkedSlugs);
  let newUnread = 0;

  for (const item of items) {
    if (!item.slug || !item.release) continue;
    const previous = seen[item.slug];
    if (
      previous &&
      previous !== item.release &&
      bookmarked.has(item.slug) &&
      !unread.some((u) => u.slug === item.slug)
    ) {
      unread.unshift({
        slug: item.slug,
        title: item.title,
        from: previous,
        to: item.release,
        at: Date.now(),
      });
      newUnread++;
    }
    seen[item.slug] = item.release;
  }

  const seenKeys = Object.keys(seen);
  if (seenKeys.length > MAX_SEEN) {
    for (const key of seenKeys.slice(0, seenKeys.length - MAX_SEEN)) delete seen[key];
  }

  try {
    storage.setItem(SEEN_KEY, JSON.stringify(seen));
    if (newUnread > 0) {
      storage.setItem(UNREAD_KEY, JSON.stringify(unread.slice(0, MAX_UNREAD)));
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    }
  } catch {
    // Ignore storage pressure.
  }

  return newUnread;
};

export const markReleasesRead = (): void => {
  write(UNREAD_KEY, []);
};

export const removeUnreadRelease = (slug: string): void => {
  write(
    UNREAD_KEY,
    getUnreadReleases().filter((item) => item.slug !== slug),
  );
};

export const subscribeReleases = (listener: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, listener);
  window.addEventListener("storage", listener);
  listener();
  return () => {
    window.removeEventListener(EVENT_NAME, listener);
    window.removeEventListener("storage", listener);
  };
};
