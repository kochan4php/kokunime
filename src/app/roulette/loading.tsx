import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /roulette: SectionHeader with genre picker + spin button, the wheel
// and its result card.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat roulette anime" className="pt-6 pb-16 md:pt-10">
      <SectionHeaderSkeleton
        titleWidth="w-80"
        className="mb-10"
        aside={
          <>
            <div className="skeleton h-10 w-40 rounded-sm" />
            <div className="skeleton h-10 w-40 rounded-sm" />
          </>
        }
      />
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <div className="skeleton mt-2 h-60 w-60 rounded-full sm:h-64 sm:w-64" />
      </div>
    </SkeletonPage>
  );
}
