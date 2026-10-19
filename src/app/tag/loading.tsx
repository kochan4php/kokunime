import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /tag: header with tag count + one card row per tag.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat daftar tag" className="pt-6 pb-8 md:pt-10 md:pb-16">
      <SectionHeaderSkeleton titleWidth="w-64" className="mb-6" badge />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card-shell">
            <div className="card-core flex items-center gap-3 p-3.5">
              <div className="skeleton h-5 w-36 rounded-sm" />
              <div className="skeleton h-5 w-16 rounded-sm" />
              <div className="ml-auto flex gap-2">
                <div className="skeleton h-8 w-20 rounded-sm" />
                <div className="skeleton h-8 w-16 rounded-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}
