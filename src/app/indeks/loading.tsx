import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /indeks: Breadcrumbs + SectionHeader + letter jump nav + per-letter
// link columns.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat indeks A–Z" breadcrumbWidth="w-40">
      <SectionHeaderSkeleton badge titleWidth="w-64" className="mb-6" />
      <div className="mb-8 flex flex-wrap gap-1.5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="skeleton h-9 w-9 rounded-sm" />
        ))}
      </div>
      <div className="space-y-8">
        {Array.from({ length: 4 }).map((_, group) => (
          <div key={group} className="card-shell">
            <div className="card-core p-5 sm:p-6">
              <div className="skeleton h-8 w-10 rounded-sm" />
              <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, row) => (
                  <div key={row} className="skeleton h-4 w-4/5 rounded" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}
