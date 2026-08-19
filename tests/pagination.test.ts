import { describe, expect, it } from "vitest";
import { buildPageHref, buildPaginationInfo, getPages, paginationHref } from "@/utils/pagination";

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

  it("handles complex genre/season endpoints correctly without duplicating params", () => {
    expect(paginationHref("genres/action?page=2")).toBe("?page=2");
    expect(paginationHref("genres/action?page=1")).toBe("?page=1");
  });

  it("routes page 1 back to root on /page basePath", () => {
    expect(paginationHref("page/1", "/page")).toBe("/");
    expect(paginationHref("page/2", "/page")).toBe("/page/2");
  });

  it("returns null for a null endpoint", () => {
    expect(paginationHref(null)).toBeNull();
  });
});

describe("buildPageHref", () => {
  it("generates root for page 1 on /page basePath", () => {
    expect(buildPageHref(1, "/page")).toBe("/");
    expect(buildPageHref(2, "/page")).toBe("/page/2");
  });

  it("generates query string when basePath is omitted", () => {
    expect(buildPageHref(1)).toBe("?page=1");
    expect(buildPageHref(3)).toBe("?page=3");
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
