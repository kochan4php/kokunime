import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { JSX } from "react";

// Mirrors /api: header with spec links, feature cards, endpoint tester list
// and the deprecation policy card.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat dokumentasi API" className="space-y-10 pt-6 pb-12 md:pt-10 md:pb-20">
      <SectionHeaderSkeleton
        badge
        titleWidth="w-96"
        className="mb-0"
        aside={
          <>
            <div className="skeleton h-10 w-44 rounded-sm" />
            <div className="skeleton h-10 w-40 rounded-sm" />
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2 rounded-sm border-2 border-border bg-surface-solid p-4">
            <div className="skeleton h-6 w-6 rounded-sm" />
            <div className="skeleton h-4 w-32 rounded-sm" />
            <div className="skeleton h-3 w-full rounded" />
          </div>
        ))}
      </div>
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b-2 border-border pb-3">
          <div className="skeleton h-7 w-7 rounded-sm" />
          <div className="skeleton h-6 w-72 max-w-full rounded-sm" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="card-shell">
              <div className="card-core space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="skeleton h-6 w-14 rounded-sm" />
                  <div className="skeleton h-5 w-48 rounded-sm" />
                </div>
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-9 w-full rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-border pb-3">
          <div className="skeleton h-7 w-7 rounded-sm" />
          <div className="skeleton h-6 w-80 max-w-full rounded-sm" />
        </div>
        <div className="space-y-2 rounded-sm border-2 border-border bg-surface-solid p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton h-4 w-full rounded" />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
