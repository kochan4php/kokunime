import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import Link from "next/link";
import { JSX } from "react";

interface MobilePaginationProps {
  current: number;
  total: number;
  prevHref: string | null;
  nextHref: string | null;
}

const MobilePagination = ({ current, total, prevHref, nextHref }: MobilePaginationProps): JSX.Element => (
  <div className="flex items-center justify-between gap-2 md:hidden">
    {prevHref ? (
      <Link
        href={prevHref}
        aria-label="Halaman sebelumnya"
        className="glass inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink transition-all duration-300 hover:text-accent active:scale-95"
      >
        <ChevronLeftIcon />
        Sebelumnya
      </Link>
    ) : (
      <span
        className="glass inline-flex h-10 cursor-not-allowed items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink-muted opacity-50"
        aria-disabled="true"
      >
        <ChevronLeftIcon />
        Sebelumnya
      </span>
    )}
    <span className="chip">
      Halaman {current} / {total}
    </span>
    {nextHref ? (
      <Link
        href={nextHref}
        aria-label="Halaman berikutnya"
        className="btn-primary inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm"
      >
        Berikutnya
        <ChevronRightIcon />
      </Link>
    ) : (
      <span
        className="btn-primary inline-flex h-10 cursor-not-allowed items-center gap-1.5 rounded-full px-4 text-sm opacity-50"
        aria-disabled="true"
      >
        Berikutnya
        <ChevronRightIcon />
      </span>
    )}
  </div>
);

export default MobilePagination;
