import {
  addToQueue,
  clearQueue,
  getQueue,
  isQueued,
  mergeQueueItems,
  moveQueueItem,
  removeFromQueue,
  restoreQueueItem,
} from "@/utils/watch-queue";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("watch queue utility", () => {
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

  it("appends items and ignores already-queued slugs", () => {
    expect(addToQueue([{ slug: "a", title: "A" }])).toBe(1);
    expect(
      addToQueue([
        { slug: "a", title: "A" },
        { slug: "b", title: "B" },
      ]),
    ).toBe(1);
    expect(getQueue().map((item) => item.slug)).toEqual(["a", "b"]);
    expect(isQueued("b")).toBe(true);
    expect(isQueued("c")).toBe(false);
  });

  it("moves items by index and ignores out-of-range moves", () => {
    addToQueue([
      { slug: "a", title: "A" },
      { slug: "b", title: "B" },
      { slug: "c", title: "C" },
    ]);
    moveQueueItem(0, 2);
    expect(getQueue().map((item) => item.slug)).toEqual(["b", "c", "a"]);
    moveQueueItem(5, 0);
    expect(getQueue()).toHaveLength(3);
    moveQueueItem(0, 0);
    expect(getQueue().map((item) => item.slug)).toEqual(["b", "c", "a"]);
  });

  it("removes and restores an item at its original position", () => {
    addToQueue([
      { slug: "a", title: "A" },
      { slug: "b", title: "B" },
      { slug: "c", title: "C" },
    ]);
    const removed = getQueue()[1]!;
    removeFromQueue("b");
    expect(getQueue().map((item) => item.slug)).toEqual(["a", "c"]);
    restoreQueueItem(removed, 1);
    expect(getQueue().map((item) => item.slug)).toEqual(["a", "b", "c"]);
  });

  it("mergeQueueItems unions without duplicating", () => {
    addToQueue([{ slug: "a", title: "A" }]);
    const added = mergeQueueItems([
      { slug: "a", title: "A", addedAt: 1 },
      { slug: "b", title: "B", addedAt: 2 },
    ]);
    expect(added).toBe(1);
    expect(getQueue().map((item) => item.slug)).toEqual(["a", "b"]);
  });

  it("clears the queue", () => {
    addToQueue([{ slug: "a", title: "A" }]);
    clearQueue();
    expect(getQueue()).toHaveLength(0);
  });

  it("survives corrupted storage", () => {
    store.kokunime_watch_queue = "{not json";
    expect(getQueue()).toHaveLength(0);
  });
});
