import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /stats: SectionHeader + six KPI cards, weekly target, four chart
// cards and the full-width folder list.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat statistik" className="pt-6 pb-16 md:pt-10">
      <SectionHeaderSkeleton
        titleWidth="w-64"
        className="mb-8"
        aside={
          <>
            <div className="skeleton h-10 w-24 rounded-sm" />
            <div className="skeleton h-10 w-28 rounded-sm" />
            <div className="skeleton h-10 w-32 rounded-sm" />
          </>
        }
      />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card-shell">
            <div className="card-core p-3.5">
              <div className="skeleton h-8 w-8 rounded-sm" />
              <div className="skeleton mt-3 h-9 w-20 rounded-sm" />
              <div className="skeleton mt-2 h-3 w-24 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 card-shell">
        <div className="card-core flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
          <div className="skeleton mx-auto h-28 w-28 rounded-full sm:mx-0" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-5 w-44 rounded-sm" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="card-shell">
            <div className="card-core p-5">
              <div className="skeleton h-5 w-48 rounded-sm" />
              <div className="skeleton mt-2 h-3 w-64 max-w-full rounded" />
              <div className="skeleton mt-4 h-28 w-full rounded-sm" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 card-shell">
        <div className="card-core p-5">
          <div className="skeleton h-5 w-40 rounded-sm" />
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skeleton h-10 rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}
