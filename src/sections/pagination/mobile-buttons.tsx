import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import PaginationButton from "./button";
import { JSX } from "react";

interface MobilePaginationProps {
  current: number;
  total: number;
  prevHref: string | null;
  nextHref: string | null;
}

const compact = "inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs";
const glassCompact = `${compact} glass font-semibold text-ink transition-all duration-300 hover:text-accent active:scale-95`;
const primaryCompact = `${compact} btn-primary`;

const MobilePagination = ({ current, total, prevHref, nextHref }: MobilePaginationProps): JSX.Element => (
  <div className="flex flex-col items-center gap-3 md:hidden">
    <span className="chip whitespace-nowrap">
      Halaman {current} / {total}
    </span>
    <div className="flex items-center gap-2">
      <PaginationButton href={prevHref} label="Halaman sebelumnya" className={glassCompact}>
        <ChevronLeftIcon className="h-3.5 w-3.5" />
        Sebelumnya
      </PaginationButton>
      <PaginationButton href={nextHref} label="Halaman berikutnya" variant="primary" className={primaryCompact}>
        Berikutnya
        <ChevronRightIcon className="h-3.5 w-3.5" />
      </PaginationButton>
    </div>
  </div>
);

export default MobilePagination;
