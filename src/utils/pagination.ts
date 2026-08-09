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
