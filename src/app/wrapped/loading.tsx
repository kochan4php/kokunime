import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /wrapped: header controls + monthly chart, summary card and the
// top-rated list.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat wrapped tahunan" className="pt-6 pb-16 md:pt-10">
      <SectionHeaderSkeleton
        titleWidth="w-64"
        className="mb-8"
        aside={
          <>
            <div className="skeleton h-10 w-24 rounded-sm" />
            <div className="skeleton h-10 w-24 rounded-sm" />
            <div className="skeleton h-10 w-28 rounded-sm" />
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card-shell lg:col-span-2">
          <div className="card-core p-5">
            <div className="skeleton h-5 w-48 rounded-sm" />
            <div className="skeleton mt-4 h-40 w-full rounded-sm" />
          </div>
        </div>
        <div className="card-shell">
          <div className="card-core space-y-4 p-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-3">
                <div className="skeleton h-3 w-28 rounded-sm" />
                <div className="skeleton h-6 w-12 rounded-sm" />
              </div>
            ))}
            <div className="skeleton h-10 w-full rounded-sm" />
          </div>
        </div>
        <div className="card-shell lg:col-span-3">
          <div className="card-core p-5">
            <div className="skeleton h-5 w-56 rounded-sm" />
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="skeleton h-10 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}
