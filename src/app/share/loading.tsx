import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /share: one centered share-target result card.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat tautan" className="pt-10 pb-16 md:pt-16">
      <div className="card-shell mx-auto max-w-xl">
        <div className="card-core flex flex-col items-center gap-3 p-8 text-center md:p-12">
          <div className="skeleton h-7 w-28 rounded-sm" />
          <div className="skeleton h-7 w-56 max-w-full rounded-sm" />
          <div className="skeleton h-4 w-72 max-w-full rounded" />
          <div className="mt-3 flex gap-2">
            <div className="skeleton h-10 w-40 rounded-sm" />
            <div className="skeleton h-10 w-32 rounded-sm" />
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}
