import { PaginationInfo } from "@/interfaces";

export type PageItem = number | "…";

export const getPages = (current: number, total: number): PageItem[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: PageItem[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
};

export const paginationHref = (endpoint: string | null, basePath?: string): string | null => {
  const page = endpoint?.split("/")[1];
  if (!page) return null;
  return basePath ? `${basePath}/${page}` : `?page=${page}`;
};

export const buildPaginationInfo = (current: number, total: number): PaginationInfo => ({
  first_page_endpoint: "page/1",
  next_page_endpoint: current < total ? `page/${current + 1}` : null,
  current_page: current,
  pages_of: `Page ${current} of ${total}`,
  total_page: total,
  prev_page_endpoint: current > 1 ? `page/${current - 1}` : null,
  last_page_endpoint: `page/${total}`,
});
