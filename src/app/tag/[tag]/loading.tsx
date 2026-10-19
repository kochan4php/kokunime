import GridSkeleton from "@/components/cards/grid-skeleton";
import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /tag/[tag]: header with count + "all tags" link, rename/delete
// controls and the tagged-title grid.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat tag pribadi" className="pt-6 pb-8 md:pt-10 md:pb-16">
      <SectionHeaderSkeleton
        titleWidth="w-64"
        className="mb-6"
        badge
        aside={<div className="skeleton h-4 w-24 rounded-sm" />}
      />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="skeleton h-8 w-24 rounded-sm" />
        <div className="skeleton h-8 w-20 rounded-sm" />
      </div>
      <GridSkeleton count={10} />
    </SkeletonPage>
  );
}
