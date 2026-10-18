import GridSkeleton from "@/components/cards/grid-skeleton";
import { JSX } from "react";

interface ListingSkeletonProps {
  /** Section padding: AnimeListing default, or LatestGrid (home) via className. */
  className?: string;
}

// Mirrors AnimeListing's shell (SectionHeader + view/sort controls + poster
// grid) so swapping in the real content does not reflow the page.
const ListingSkeleton = ({ className = "pt-6 pb-12 md:pt-10 md:pb-20" }: ListingSkeletonProps): JSX.Element => (
  <section className={`container px-4 ${className}`} aria-label="Memuat">
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <div className="skeleton h-3 w-24 rounded-sm" />
        <div className="skeleton mt-3 h-8 w-64 max-w-full rounded-sm" />
        <div className="skeleton mt-3 h-4 w-full max-w-xl rounded" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="skeleton h-10 w-20 rounded-sm" />
        <div className="skeleton hidden h-10 w-56 rounded-sm sm:block" />
        <div className="skeleton h-10 w-32 rounded-sm" />
      </div>
    </div>
    <div className="mt-8">
      <GridSkeleton count={10} />
    </div>
  </section>
);

export default ListingSkeleton;
