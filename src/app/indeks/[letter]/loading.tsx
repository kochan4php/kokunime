import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /indeks/[letter]: Breadcrumbs + SectionHeader + search + letter nav
// + the paginated title grid.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat indeks huruf" breadcrumbWidth="w-48">
      <SectionHeaderSkeleton badge titleWidth="w-72" className="mb-6" />
      <div className="mb-6 max-w-xl">
        <div className="skeleton h-11 w-full rounded-sm" />
      </div>
      <div className="mb-8 flex flex-wrap gap-1.5">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="skeleton h-9 w-9 rounded-sm" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 18 }).map((_, index) => (
          <div key={index} className="skeleton h-4 w-4/5 rounded" />
        ))}
      </div>
    </SkeletonPage>
  );
}
