import { PaginationType } from "@/interfaces";
import Link from "next/link";

const Pagination = (props: any) => {
  const pagination: PaginationType = props.pagination;

  return (
    <>
      <div className="text-base text-slate-400">
        <span>Page </span>
        <span className="font-semibold text-white">{pagination.current_page}</span>
        <span> of </span>
        <span className="font-semibold text-white">{pagination.total_page}</span>
        <span> pages</span>
      </div>
      <div className="inline-flex mt-2 xs:mt-0">
        <Link
          href={
            pagination.prev_page_endpoint?.split("/")[1] ? `?page=${pagination.prev_page_endpoint?.split("/")[1]}` : "/"
          }
          className="flex gap-2 items-center justify-center transition-all duration-200 px-4 h-10 text-base font-medium text-white bg-slate-700 rounded-l hover:bg-slate-600 hover:text-teal-300 border-slate-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Prev</span>
        </Link>
        <Link
          href={
            pagination.next_page_endpoint?.split("/")[1]
              ? `?page=${pagination.next_page_endpoint?.split("/")[1]}`
              : `?page=${pagination.total_page}`
          }
          className="flex gap-2 items-center justify-center transition-all duration-200 px-4 h-10 text-base font-medium text-white bg-slate-700 border-0 border-l border-slate-700 rounded-r hover:bg-slate-600 hover:text-teal-300"
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </Link>
      </div>
    </>
  );
};

export default Pagination;
