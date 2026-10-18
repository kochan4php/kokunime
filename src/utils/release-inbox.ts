"use client";

import { STORAGE_KEYS } from "@/utils/storage-keys";

export interface UnreadRelease {
  slug: string;
  title: string;
  from: string;
  to: string;
  at: number;
  read?: boolean;
  readAt?: number;
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
const MAX_INBOX = 50;

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

// Snapshot caches for useSyncExternalStore: the parsed arrays must keep the
// same reference while localStorage is unchanged, otherwise React sees a new
// snapshot every render and loops ("getSnapshot should be cached"). Read
// entries stay in the inbox ("Semua" view) and are only filtered out of the
// unread snapshot.
let cachedRaw: string | null = null;
let cachedInbox: UnreadRelease[] = [];
let cachedUnread: UnreadRelease[] = [];

export const getInboxReleases = (): UnreadRelease[] => {
  const storage = getStorage();
  if (!storage) return cachedInbox;

  let raw: string | null = null;
  try {
    raw = storage.getItem(UNREAD_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedInbox;

  cachedRaw = raw;
  cachedInbox = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as UnreadRelease[];
      if (Array.isArray(parsed)) cachedInbox = parsed;
    } catch {
      // Corrupt blob — keep the empty snapshot.
    }
  }
  cachedUnread = cachedInbox.filter((item) => !item.read);
  return cachedInbox;
};

export const getUnreadReleases = (): UnreadRelease[] => {
  getInboxReleases(); // refreshes both caches when storage changed
  return cachedUnread;
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
  // Copy: getInboxReleases returns the cached snapshot and must not be mutated.
  let inbox = [...getInboxReleases()];
  const bookmarked = new Set(bookmarkedSlugs);
  let newUnread = 0;

  for (const item of items) {
    if (!item.slug || !item.release) continue;
    const previous = seen[item.slug];
    // A read history entry for the same slug is expected: the new release
    // replaces it so the inbox never stacks duplicates of one title.
    const alreadyUnread = inbox.some((u) => u.slug === item.slug && !u.read);
    if (previous && previous !== item.release && bookmarked.has(item.slug) && !alreadyUnread) {
      inbox = [
        {
          slug: item.slug,
          title: item.title,
          from: previous,
          to: item.release,
          at: Date.now(),
        },
        ...inbox.filter((u) => u.slug !== item.slug),
      ];
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
      storage.setItem(UNREAD_KEY, JSON.stringify(inbox.slice(0, MAX_INBOX)));
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    }
  } catch {
    // Ignore storage pressure.
  }

  return newUnread;
};

// "Mark all read" keeps history: entries flip to read and stay listed under
// the Semua filter, so the bell count drops without losing context.
export const markReleasesRead = (): void => {
  const before = getInboxReleases();
  if (before.every((item) => item.read)) return;
  const now = Date.now();
  write(
    UNREAD_KEY,
    before.map((item) => (item.read ? item : { ...item, read: true, readAt: now })),
  );
};

export const markReleaseRead = (slug: string): void => {
  const before = getInboxReleases();
  if (!before.some((item) => item.slug === slug && !item.read)) return;
  const now = Date.now();
  write(
    UNREAD_KEY,
    before.map((item) => (item.slug === slug && !item.read ? { ...item, read: true, readAt: now } : item)),
  );
};

export const removeUnreadRelease = (slug: string): void => {
  write(
    UNREAD_KEY,
    getInboxReleases().filter((item) => item.slug !== slug),
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
