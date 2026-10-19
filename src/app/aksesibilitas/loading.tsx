import { ProseSkeleton, SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <SkeletonPage
      label="Memuat pernyataan aksesibilitas"
      containerClassName="container mx-auto max-w-3xl px-4"
      className="pt-8 pb-16 md:pt-12"
    >
      <SectionHeaderSkeleton titleWidth="w-80" />
      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="skeleton h-7 w-24 rounded-sm" />
        ))}
      </div>
      <ProseSkeleton sections={3} />
    </SkeletonPage>
  );
}
