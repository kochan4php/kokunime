import GridSkeleton from "@/components/cards/grid-skeleton";
import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

// Mirrors /update: Breadcrumbs + SectionHeader (ICS aside) + bucket jump nav
// + per-day groups of the release grid.
export default function Loading(): JSX.Element {
  return (
    <MainLayout>
      <div className="container px-4 pt-4">
        <div className="skeleton h-4 w-32 rounded-sm" />
      </div>
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20" aria-label="Memuat timeline update">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="skeleton h-3 w-20 rounded-sm" />
            <div className="skeleton mt-3 h-8 w-56 max-w-full rounded-sm" />
            <div className="skeleton mt-3 h-4 w-full max-w-2xl rounded" />
          </div>
          <div className="skeleton h-10 w-44 rounded-sm" />
        </div>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton h-7 w-28 rounded-sm" />
          ))}
        </div>
        {Array.from({ length: 2 }).map((_, group) => (
          <div key={group} className="mt-10">
            <div className="flex flex-wrap items-baseline gap-2">
              <div className="skeleton h-7 w-40 rounded-sm" />
              <div className="skeleton h-4 w-36 rounded-sm" />
            </div>
            <div className="mt-4">
              <GridSkeleton count={5} />
            </div>
          </div>
        ))}
      </section>
    </MainLayout>
  );
}
