import { ProseSkeleton, SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <SkeletonPage
      label="Memuat kebijakan privasi"
      containerClassName="container mx-auto max-w-3xl px-4"
      className="pt-8 pb-16 md:pt-12"
    >
      <SectionHeaderSkeleton titleWidth="w-80" />
      <ProseSkeleton />
    </SkeletonPage>
  );
}
