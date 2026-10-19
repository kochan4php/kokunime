import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /settings: header + the 12-column dashboard (preview, preference
// cards on the left; storage and about cards in the sidebar).
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat pengaturan">
      <SectionHeaderSkeleton
        titleWidth="w-80"
        className="mb-8"
        badge={<div className="skeleton h-6 w-28 rounded-sm" />}
        aside={
          <>
            <div className="skeleton h-10 w-36 rounded-sm" />
            <div className="skeleton h-10 w-36 rounded-sm" />
          </>
        }
      />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="skeleton h-44 w-full rounded-sm" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card-shell">
              <div className="card-core space-y-4 p-5">
                <div className="skeleton h-5 w-48 rounded-sm" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, option) => (
                    <div key={option} className="skeleton h-10 rounded-sm" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6 lg:col-span-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="card-shell">
              <div className="card-core space-y-3 p-5">
                <div className="skeleton h-5 w-40 rounded-sm" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-10 w-full rounded-sm" />
                <div className="skeleton h-10 w-full rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
