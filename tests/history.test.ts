import { describe, expect, it, beforeEach, vi } from "vitest";
import { getHistory, recordHistory, removeHistory, clearAllHistory } from "@/utils/history";

describe("history utility", () => {
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

  it("records history items and puts recent at top", () => {
    recordHistory({ slug: "anime-1", title: "Anime 1" });
    recordHistory({ slug: "anime-2", title: "Anime 2" });

    const list = getHistory();
    expect(list).toHaveLength(2);
    expect(list[0].slug).toBe("anime-2");
    expect(list[1].slug).toBe("anime-1");
  });

  it("deduplicates already viewed items to top", () => {
    recordHistory({ slug: "anime-1", title: "Anime 1" });
    recordHistory({ slug: "anime-2", title: "Anime 2" });
    recordHistory({ slug: "anime-1", title: "Anime 1" });

    const list = getHistory();
    expect(list).toHaveLength(2);
    expect(list[0].slug).toBe("anime-1");
  });

  it("removes history item by slug", () => {
    recordHistory({ slug: "anime-1", title: "Anime 1" });
    recordHistory({ slug: "anime-2", title: "Anime 2" });

    removeHistory("anime-1");
    const list = getHistory();
    expect(list).toHaveLength(1);
    expect(list[0].slug).toBe("anime-2");
  });

  it("clears all history items", () => {
    recordHistory({ slug: "anime-1", title: "Anime 1" });
    recordHistory({ slug: "anime-2", title: "Anime 2" });

    clearAllHistory();
    expect(getHistory()).toHaveLength(0);
  });
});
