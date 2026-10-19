import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <SkeletonPage
      label="Memuat komparasi anime"
      containerClassName="container max-w-6xl px-4"
      className="pt-6 pb-12 md:pt-10 md:pb-20"
    >
      <SectionHeaderSkeleton badge titleWidth="w-80" className="mb-8" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="skeleton h-80 rounded-sm" />
        <div className="skeleton h-80 rounded-sm" />
      </div>
    </SkeletonPage>
  );
}
