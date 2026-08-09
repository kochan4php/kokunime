import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import PaginationButton from "./button";
import { JSX } from "react";

interface MobilePaginationProps {
  current: number;
  total: number;
  prevHref: string | null;
  nextHref: string | null;
}

const MobilePagination = ({ current, total, prevHref, nextHref }: MobilePaginationProps): JSX.Element => (
  <div className="flex items-center justify-between gap-2 md:hidden">
    <PaginationButton href={prevHref} label="Halaman sebelumnya">
      <ChevronLeftIcon />
      Sebelumnya
    </PaginationButton>
    <span className="chip">
      Halaman {current} / {total}
    </span>
    <PaginationButton href={nextHref} label="Halaman berikutnya" variant="primary">
      Berikutnya
      <ChevronRightIcon />
    </PaginationButton>
  </div>
);

export default MobilePagination;
