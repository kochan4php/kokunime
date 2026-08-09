import { describe, expect, it } from "vitest";
import { buildPaginationInfo, getPages, paginationHref } from "@/utils/pagination";

describe("getPages", () => {
  it("returns every page when the total is small", () => {
    expect(getPages(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("inserts an ellipsis for large totals", () => {
    expect(getPages(10, 100)).toContain("…");
  });
});

describe("paginationHref", () => {
  it("turns an endpoint into a query string", () => {
    expect(paginationHref("page/3")).toBe("?page=3");
  });

  it("returns null for a null endpoint", () => {
    expect(paginationHref(null)).toBeNull();
  });
});

describe("buildPaginationInfo", () => {
  it("builds prev/next correctly", () => {
    const info = buildPaginationInfo(2, 5);
    expect(info.current_page).toBe(2);
    expect(info.total_page).toBe(5);
    expect(info.prev_page_endpoint).toBe("page/1");
    expect(info.next_page_endpoint).toBe("page/3");
  });

  it("nulls the next endpoint on the last page", () => {
    expect(buildPaginationInfo(5, 5).next_page_endpoint).toBeNull();
  });
});
