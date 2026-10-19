import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { SkeletonPage } from "@/components/skeletons/page-skeleton";
import { JSX } from "react";

// Mirrors /status: SectionHeader + three rollup cards + uptime chart + daily
// history rows + device diagnostics.
export default function Loading(): JSX.Element {
  return (
    <SkeletonPage label="Memuat status layanan" className="pt-6 pb-8 md:pt-10 md:pb-16">
      <SectionHeaderSkeleton badge titleWidth="w-64" className="mb-6" />
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="card-shell">
            <div className="card-core p-4">
              <div className="skeleton h-3 w-24 rounded-sm" />
              <div className="skeleton mt-2 h-7 w-20 rounded-sm" />
              <div className="skeleton mt-2 h-3 w-28 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
      <div className="card-shell mt-3">
        <div className="card-core p-4">
          <div className="flex items-center justify-between">
            <div className="skeleton h-3 w-32 rounded-sm" />
            <div className="skeleton h-3 w-16 rounded-sm" />
          </div>
          <div className="skeleton mt-3 h-12 w-full rounded-sm" />
        </div>
      </div>
      <div className="skeleton mt-8 h-6 w-36 rounded-sm" />
      <div className="mt-3 space-y-1.5">
        {Array.from({ length: 8 }).map((_, row) => (
          <div key={row} className="skeleton h-9 rounded-sm" />
        ))}
      </div>
      <div className="card-shell mt-8">
        <div className="card-core p-5">
          <div className="skeleton h-5 w-44 rounded-sm" />
          <div className="mt-3 skeleton h-4 w-full rounded" />
          <div className="mt-2 skeleton h-4 w-3/4 rounded" />
        </div>
      </div>
    </SkeletonPage>
  );
}
