import GridSkeleton from "@/components/cards/grid-skeleton";
import { BreadcrumbSkeleton, SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { JSX } from "react";

interface ListingSkeletonProps {
  /** Section padding: AnimeListing default, or LatestGrid (home) via className. */
  className?: string;
  /** Render the breadcrumb row used by genre/season/year/studio detail pages. */
  breadcrumb?: boolean;
  /** Render the pagination strip used by paginated listings. */
  pagination?: boolean;
}

// Mirrors AnimeListing's shell (SectionHeader + view/sort controls + poster
// grid) so swapping in the real content does not reflow the page.
const ListingSkeleton = ({
  className = "pt-6 pb-12 md:pt-10 md:pb-20",
  breadcrumb = false,
  pagination = false,
}: ListingSkeletonProps): JSX.Element => (
  <>
    {breadcrumb && <BreadcrumbSkeleton />}
    <section className={`container px-4 ${className}`} aria-label="Memuat daftar anime">
      <SectionHeaderSkeleton
        badge
        titleWidth="w-72"
        className="mb-8"
        aside={
          <>
            <div className="skeleton h-10 w-20 rounded-sm" />
            <div className="skeleton hidden h-10 w-56 rounded-sm sm:block" />
            <div className="skeleton h-10 w-32 rounded-sm" />
            <div className="skeleton hidden h-4 w-20 xl:block" />
          </>
        }
      />
      <GridSkeleton />
      {pagination && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton h-10 w-10 rounded-sm" />
          ))}
        </div>
      )}
    </section>
  </>
);

export default ListingSkeleton;
