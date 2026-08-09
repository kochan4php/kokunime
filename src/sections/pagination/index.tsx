import MobilePagination from "./mobile-buttons";
import PageNumbers from "./numbers";
import { paginationHref } from "@/utils/pagination";
import { JSX } from "react";

const Pagination = (props: any): JSX.Element => {
  const { current_page, total_page, prev_page_endpoint, next_page_endpoint } = props.pagination ?? {};
  const current = current_page ?? 1;
  const total = total_page ?? 1;

  const prevHref = paginationHref(prev_page_endpoint);
  const nextHref = paginationHref(next_page_endpoint);

  return (
    <div className="mt-14 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <p className="hidden font-mono text-xs uppercase tracking-widest text-ink-muted md:block">
        Halaman {current} dari {total}
      </p>
      <MobilePagination current={current} total={total} prevHref={prevHref} nextHref={nextHref} />
      <PageNumbers current={current} total={total} prevHref={prevHref} nextHref={nextHref} />
    </div>
  );
};

export default Pagination;
