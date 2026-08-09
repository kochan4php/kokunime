import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { parsePagination } from "@/services/scraper/parse-pagination";

describe("parsePagination", () => {
  it("parses current and total pages", () => {
    const html = `
      <div class="venutama">
        <div class="pagination"><div class="wp-pagenavi">
          <span class="current">1</span><span class="pages">Page 1 of 10</span>
        </div></div>
      </div>`;
    const pagination = parsePagination(load(html));
    expect(pagination?.current_page).toBe(1);
    expect(pagination?.total_page).toBe(10);
    expect(pagination?.next_page_endpoint).toBe("page/2");
  });

  it("returns null when there is no pagination", () => {
    expect(parsePagination(load("<html></html>"))).toBeNull();
  });
});
