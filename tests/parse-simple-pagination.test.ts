import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { parseSimplePagination } from "@/services/scraper/parse-simple-pagination";
import { UPSTREAM_URL } from "@/services/scraper/constants";

describe("parseSimplePagination", () => {
  it("builds prev/next from rel links", () => {
    const html = `
      <html><head>
        <link rel="next" href="${UPSTREAM_URL}genres/action/page/2/" />
        <link rel="prev" href="${UPSTREAM_URL}genres/action/" />
      </head></html>`;
    const pagination = parseSimplePagination(load(html), 2);
    expect(pagination?.current_page).toBe(2);
    expect(pagination?.next_page_endpoint).toBe("page/3");
    expect(pagination?.prev_page_endpoint).toBe("page/1");
  });

  it("returns null when there are no nav links", () => {
    expect(parseSimplePagination(load("<html></html>"), 1)).toBeNull();
  });
});
