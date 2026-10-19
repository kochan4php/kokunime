import GridSkeleton from "@/components/cards/grid-skeleton";
import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /search/[query]: SectionHeader + result controls + poster grid +
// the local-catalog panel below the results.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat hasil pencarian" className="pt-6 pb-8 md:pt-10 md:pb-16">
      <SectionHeaderSkeleton badge titleWidth="w-64" className="mb-6" />
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="skeleton h-10 w-20 rounded-sm" />
        <div className="skeleton h-10 w-32 rounded-sm" />
        <div className="skeleton h-10 w-28 rounded-sm" />
        <div className="skeleton h-10 w-24 rounded-sm" />
      </div>
      <div className="mt-6">
        <GridSkeleton count={10} />
      </div>
      <div className="card-shell mt-8">
        <div className="card-core space-y-3 p-4 sm:p-5">
          <div className="skeleton h-6 w-40 rounded-sm" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-3/4 rounded" />
        </div>
      </div>
    </SkeletonPage>
  );
}
