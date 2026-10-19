import GridSkeleton from "@/components/cards/grid-skeleton";
import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /update: Breadcrumbs + SectionHeader (ICS aside) + bucket jump nav
// + per-day groups of the release grid.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat timeline update" breadcrumbWidth="w-32" className="pt-6 pb-12 md:pt-10 md:pb-20">
      <SectionHeaderSkeleton
        titleWidth="w-56"
        className="mb-8"
        aside={<div className="skeleton h-10 w-44 rounded-sm" />}
      />
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="skeleton h-7 w-28 rounded-sm" />
        ))}
      </div>
      {Array.from({ length: 2 }).map((_, group) => (
        <div key={group} className="mt-10">
          <div className="flex flex-wrap items-baseline gap-2">
            <div className="skeleton h-7 w-40 rounded-sm" />
            <div className="skeleton h-4 w-36 rounded-sm" />
          </div>
          <div className="mt-4">
            <GridSkeleton count={5} />
          </div>
        </div>
      ))}
    </SkeletonPage>
  );
}
