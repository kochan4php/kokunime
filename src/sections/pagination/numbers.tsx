import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { buildPageHref, getPages } from "@/utils/pagination";
import Link from "next/link";
import { JSX } from "react";

interface PageNumbersProps {
  current: number;
  total: number;
  prevHref: string | null;
  nextHref: string | null;
  basePath?: string;
}

const navButton =
  "flex h-11 w-11 items-center justify-center rounded-sm border-2 border-border bg-surface text-ink shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--border)] active:translate-y-0 active:shadow-none";

const PageNumbers = ({ current, total, prevHref, nextHref, basePath }: PageNumbersProps): JSX.Element => (
  <div className="hidden items-center gap-1.5 md:flex">
    {prevHref ? (
      <Link href={prevHref} aria-label="Halaman sebelumnya" className={navButton}>
        <ChevronLeftIcon />
      </Link>
    ) : (
      <span className={`${navButton} cursor-not-allowed opacity-40`} aria-disabled="true">
        <ChevronLeftIcon />
      </span>
    )}
    {getPages(current, total).map((page, index) =>
      page === "…" ? (
        <span
          key={`ellipsis-${index}`}
          aria-hidden
          className="flex h-11 items-center px-1 font-mono text-sm text-ink-muted"
        >
          …
        </span>
      ) : (
        <Link
          key={`page-${page}`}
          href={buildPageHref(page, basePath)}
          aria-label={`Halaman ${page}`}
          aria-current={page === current ? "page" : undefined}
          className={
            page === current
              ? "flex h-11 w-11 items-center justify-center rounded-sm border-2 border-border bg-accent text-sm font-black text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-transform duration-150"
              : "glass flex h-11 w-11 items-center justify-center rounded-sm text-sm font-semibold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--border)] active:translate-y-0 active:shadow-none"
          }
        >
          {page}
        </Link>
      ),
    )}
    {nextHref ? (
      <Link href={nextHref} aria-label="Halaman berikutnya" className={navButton}>
        <ChevronRightIcon />
      </Link>
    ) : (
      <span className={`${navButton} cursor-not-allowed opacity-40`} aria-disabled="true">
        <ChevronRightIcon />
      </span>
    )}
  </div>
);

export default PageNumbers;
