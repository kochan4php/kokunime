import { PaginationInfo } from "@/interfaces";
import { CheerioAPI } from "cheerio";

export function parseSimplePagination($: CheerioAPI, currentPage: number): PaginationInfo | null {
  const next = $('link[rel="next"]').attr("href");
  const prev = $('link[rel="prev"]').attr("href");

  if (!next && !prev) return null;

  return {
    first_page_endpoint: "page/1",
    next_page_endpoint: next ? `page/${currentPage + 1}` : null,
    current_page: currentPage,
    pages_of: `Page ${currentPage}`,
    total_page: 0,
    prev_page_endpoint: prev ? `page/${currentPage - 1}` : null,
    last_page_endpoint: `page/${currentPage}`,
  };
}
