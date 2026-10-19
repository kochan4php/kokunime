import GridSkeleton from "@/components/cards/grid-skeleton";
import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /bookmarks: SectionHeader with the three collection tabs, status
// filters, folder bar and the saved-titles grid.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat koleksi pribadi" className="pt-6 pb-8 md:pt-10 md:pb-16">
      <SectionHeaderSkeleton
        titleWidth="w-72"
        className="mb-6"
        badge={
          <>
            <div className="skeleton h-8 w-28 rounded-sm" />
            <div className="skeleton h-8 w-24 rounded-sm" />
            <div className="skeleton h-8 w-32 rounded-sm" />
          </>
        }
        aside={
          <>
            <div className="skeleton h-10 w-24 rounded-sm" />
            <div className="skeleton h-10 w-28 rounded-sm" />
            <div className="skeleton h-10 w-24 rounded-sm" />
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="skeleton h-8 w-24 rounded-sm" />
        ))}
      </div>
      <div className="skeleton mb-6 h-14 w-full rounded-sm" />
      <GridSkeleton count={10} />
    </SkeletonPage>
  );
}
