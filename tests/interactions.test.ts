// @vitest-environment jsdom
// Interaction flows without testing-library: createRoot + act + real DOM events.
import { act, createElement, type ReactElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SearchHistoryChips from "@/components/search-history-chips";
import { STORAGE_KEYS } from "@/utils/storage-keys";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href?: unknown; children?: unknown }) =>
    createElement("a", { href: typeof href === "string" ? href : "#", ...rest }, children as never),
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement | null = null;
let root: Root | null = null;

const render = async (node: ReactElement): Promise<void> => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root?.render(node));
};

const storedRecent = (): string[] => {
  const raw = window.localStorage.getItem(STORAGE_KEYS.recentSearches);
  return raw ? (JSON.parse(raw) as string[]) : [];
};

const click = async (element: Element): Promise<void> => {
  await act(async () => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
};

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(async () => {
  if (root) await act(async () => root?.unmount());
  container?.remove();
  container = null;
  root = null;
});

describe("SearchHistoryChips interaction flow", () => {
  it("records the query, removes a chip, then clears everything", async () => {
    window.localStorage.setItem(STORAGE_KEYS.recentSearches, JSON.stringify(["naruto", "bleach"]));
    await render(createElement(SearchHistoryChips, { query: "one piece" }));

    // Current query lands at the front of the stored list.
    expect(storedRecent()[0]).toBe("one piece");

    const removeButton = [...container!.querySelectorAll("button")].find(
      (button) => button.getAttribute("aria-label") === "Hapus naruto dari riwayat pencarian",
    );
    expect(removeButton).toBeTruthy();
    await click(removeButton!);

    expect(storedRecent()).not.toContain("naruto");
    expect(container!.textContent).not.toContain("naruto");
    expect(container!.textContent).toContain("bleach");

    const clearButton = [...container!.querySelectorAll("button")].find((button) => button.textContent === "Bersihkan");
    expect(clearButton).toBeTruthy();
    await click(clearButton!);

    expect(storedRecent()).toEqual([]);
    // Nothing visible left → the component renders nothing at all.
    expect(container!.textContent).toBe("");
  });

  it("renders nothing on an empty history", async () => {
    await render(createElement(SearchHistoryChips, { query: "" }));
    expect(container!.textContent).toBe("");
  });
});
