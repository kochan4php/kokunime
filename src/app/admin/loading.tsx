import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import { JSX } from "react";

// Mirrors /admin: compact ops console without the public navbar/footer.
export default function Loading(): JSX.Element {
  return (
    <main className="container mx-auto min-h-screen px-4 py-10" aria-label="Memuat admin ops">
      <div className="mx-auto max-w-3xl">
        <SectionHeaderSkeleton titleWidth="w-56" />
        <div className="mt-6 space-y-2">
          <div className="skeleton h-3 w-56 rounded-sm" />
          <div className="skeleton h-10 w-full rounded-sm" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton h-10 w-28 rounded-sm" />
          ))}
        </div>
        <div className="mt-6 card-shell">
          <div className="card-core space-y-3 p-5">
            <div className="skeleton h-5 w-40 rounded-sm" />
            <div className="skeleton h-24 w-full rounded-sm" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
