import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

// Mirrors /seasons: SectionHeader + SeasonsExplorer (4-cycle guide, year
// filter pills + search, per-year season groups).
export default function Loading(): JSX.Element {
  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20" aria-label="Memuat daftar musim">
        <div className="skeleton h-3 w-24 rounded-sm" />
        <div className="skeleton mt-3 h-8 w-72 max-w-full rounded-sm" />
        <div className="skeleton mt-3 h-4 w-full max-w-2xl rounded" />
        <div className="mt-8 space-y-12">
          <div className="space-y-4">
            <div className="skeleton h-6 w-56 max-w-full rounded-sm" />
            <div className="skeleton h-3 w-full max-w-sm rounded" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton h-28 rounded-sm" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="skeleton h-9 w-24 rounded-sm" />
                ))}
              </div>
              <div className="skeleton h-10 w-full rounded-sm md:w-64" />
            </div>
            <div className="space-y-10 pt-4">
              {Array.from({ length: 2 }).map((_, group) => (
                <div key={group} className="space-y-4 rounded-sm border-2 border-border bg-surface p-5 md:p-6">
                  <div className="flex items-center justify-between border-b-2 border-border pb-3">
                    <div className="flex items-center gap-3">
                      <div className="skeleton h-8 w-16 rounded-sm" />
                      <div className="skeleton h-5 w-32 rounded-sm" />
                    </div>
                    <div className="skeleton h-4 w-36 rounded-sm" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, card) => (
                      <div key={card} className="skeleton h-16 rounded-sm" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
