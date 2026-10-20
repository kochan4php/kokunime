import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /indeks: Breadcrumbs + SectionHeader + search + letter counts.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat indeks A–Z" breadcrumbWidth="w-40">
      <SectionHeaderSkeleton badge titleWidth="w-64" className="mb-6" />
      <div className="mb-6 max-w-xl">
        <div className="skeleton h-11 w-full rounded-sm" />
      </div>
      <div className="mb-8 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
        {Array.from({ length: 27 }).map((_, index) => (
          <div key={index} className="skeleton h-16 rounded-sm" />
        ))}
      </div>
      <div className="skeleton h-4 w-80 max-w-full rounded" />
    </SkeletonPage>
  );
}
