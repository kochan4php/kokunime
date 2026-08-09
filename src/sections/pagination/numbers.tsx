import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { getPages } from "@/utils/pagination";
import Link from "next/link";
import { JSX } from "react";

interface PageNumbersProps {
  current: number;
  total: number;
  prevHref: string | null;
  nextHref: string | null;
}

const navButton =
  "flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-all duration-300 hover:bg-surface-muted hover:text-accent active:scale-95";

const PageNumbers = ({ current, total, prevHref, nextHref }: PageNumbersProps): JSX.Element => (
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
        <span key={index} aria-hidden className="flex h-10 items-center px-1 font-mono text-sm text-ink-muted">
          …
        </span>
      ) : (
        <Link
          key={index}
          href={`?page=${page}`}
          aria-label={`Halaman ${page}`}
          aria-current={page === current ? "page" : undefined}
          className={
            page === current
              ? "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-sm font-bold text-white shadow-[0_10px_24px_-10px_var(--glow-accent)] transition-transform duration-300 active:scale-95"
              : "glass flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-ink transition-all duration-300 hover:text-accent active:scale-95"
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
