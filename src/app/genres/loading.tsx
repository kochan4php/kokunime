import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /genres: SectionHeader + GenresExplorer (search bar + genre tiles).
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat daftar genre">
      <SectionHeaderSkeleton titleWidth="w-64" className="mb-8" />
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="skeleton h-12 w-full max-w-md rounded-sm" />
          <div className="skeleton h-4 w-44 rounded-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2.5 min-[500px]:grid-cols-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="skeleton h-[6.25rem] rounded-sm" />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
