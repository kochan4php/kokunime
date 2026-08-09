import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import PaginationButton from "./button";
import { PaginationInfo } from "@/interfaces";
import { paginationHref } from "@/utils/pagination";
import { JSX } from "react";

interface PaginationBarProps {
  pagination: PaginationInfo;
}

const PaginationBar = ({ pagination }: PaginationBarProps): JSX.Element => {
  const { current_page, total_page, prev_page_endpoint, next_page_endpoint } = pagination;
  const prevHref = paginationHref(prev_page_endpoint);
  const nextHref = paginationHref(next_page_endpoint);
  const knownTotal = total_page > current_page;

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
        Halaman {current_page}
        {knownTotal ? ` dari ${total_page}` : ""}
      </p>
      <div className="flex items-center gap-2">
        <PaginationButton href={prevHref} label="Halaman sebelumnya">
          <ChevronLeftIcon />
          Sebelumnya
        </PaginationButton>
        <PaginationButton href={nextHref} label="Halaman berikutnya" variant="primary">
          Berikutnya
          <ChevronRightIcon />
        </PaginationButton>
      </div>
    </div>
  );
};

export default PaginationBar;
