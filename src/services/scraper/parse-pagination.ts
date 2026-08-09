import { PaginationInfo } from "@/interfaces";
import { CheerioAPI } from "cheerio";

export function parsePagination($: CheerioAPI): PaginationInfo | null {
  const element = $(".venutama");
  const current_page = Number($(element).find(".pagination .wp-pagenavi .current").text());
  const pagesText = $(element).find(".pagination .wp-pagenavi .pages").text();
  const total_page = Number(pagesText.split("of")[1]?.trim());

  if (!Number.isFinite(current_page) || !Number.isFinite(total_page) || total_page < 1) return null;

  return {
    first_page_endpoint: "page/1",
    next_page_endpoint: current_page === total_page ? null : `page/${current_page + 1}`,
    current_page,
    pages_of: pagesText,
    total_page,
    prev_page_endpoint: current_page > 1 ? `page/${current_page - 1}` : null,
    last_page_endpoint: `page/${total_page}`,
  };
}
