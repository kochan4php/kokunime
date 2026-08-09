import { PaginationType } from "@/interfaces";
import Link from "next/link";
import { JSX } from "react";

const ChevronLeft = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const getPages = (current: number, total: number): (number | "…")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
};

const Pagination = (props: any): JSX.Element => {
  const { current_page, total_page, prev_page_endpoint, next_page_endpoint } = props.pagination ?? {};
  const current = current_page ?? 1;
  const total = total_page ?? 1;
  const pages = getPages(current, total);

  const prevHref = prev_page_endpoint?.split("/")[1] ? `?page=${prev_page_endpoint.split("/")[1]}` : null;
  const nextHref = next_page_endpoint?.split("/")[1] ? `?page=${next_page_endpoint.split("/")[1]}` : null;

  return (
    <div className="mt-14">
      <p className="mb-5 hidden font-mono text-xs uppercase tracking-widest text-ink-muted md:block">
        Halaman {current} dari {total}
      </p>

      <div className="flex items-center justify-between gap-2 md:hidden">
        {prevHref ? (
          <Link
            href={prevHref}
            className="glass inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink transition-all duration-300 hover:text-accent"
          >
            <ChevronLeft />
            Sebelumnya
          </Link>
        ) : (
          <span className="glass inline-flex h-10 cursor-not-allowed items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink-muted opacity-50">
            <ChevronLeft />
            Sebelumnya
          </span>
        )}
        <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          {current} / {total}
        </span>
        {nextHref ? (
          <Link href={nextHref} className="btn-primary inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm">
            Berikutnya
            <ChevronRight />
          </Link>
        ) : (
          <span className="btn-primary inline-flex h-10 cursor-not-allowed items-center gap-1.5 rounded-full px-4 text-sm opacity-50">
            Berikutnya
            <ChevronRight />
          </span>
        )}
      </div>

      <div className="hidden items-center gap-1.5 md:flex">
        {pages.map((page, index) =>
          page === "…" ? (
            <span key={index} className="flex h-10 items-center px-1 font-mono text-sm text-ink-muted">
              …
            </span>
          ) : (
            <Link
              key={index}
              href={`?page=${page}`}
              aria-current={page === current ? "page" : undefined}
              className={
                page === current
                  ? "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-sm font-bold text-white shadow-[0_10px_24px_-10px_var(--glow-accent)] transition-transform duration-300 active:scale-95"
                  : "glass flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-ink transition-all duration-300 hover:text-accent"
              }
            >
              {page}
            </Link>
          ),
        )}
      </div>
    </div>
  );
};

export default Pagination;
