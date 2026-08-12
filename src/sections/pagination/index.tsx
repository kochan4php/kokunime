import MobilePagination from "./mobile-buttons";
import PageNumbers from "./numbers";
import { PaginationInfo } from "@/interfaces";
import { paginationHref } from "@/utils/pagination";
import { JSX } from "react";

interface PaginationProps {
  pagination?: PaginationInfo | null;
  basePath?: string;
}

const Pagination = ({ pagination, basePath }: PaginationProps): JSX.Element => {
  const { current_page, total_page, prev_page_endpoint, next_page_endpoint } = pagination ?? {};
  const current = current_page ?? 1;
  const total = total_page ?? 1;

  const prevHref = paginationHref(prev_page_endpoint ?? null, basePath);
  const nextHref = paginationHref(next_page_endpoint ?? null, basePath);

  return (
    <div className="mt-14 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <p className="hidden font-mono text-xs uppercase tracking-widest text-ink-muted md:block">
        Halaman {current} dari {total}
      </p>
      <MobilePagination current={current} total={total} prevHref={prevHref} nextHref={nextHref} />
      <PageNumbers current={current} total={total} prevHref={prevHref} nextHref={nextHref} basePath={basePath} />
    </div>
  );
};

export default Pagination;
