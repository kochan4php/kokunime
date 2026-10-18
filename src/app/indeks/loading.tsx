import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

// Mirrors /indeks: Breadcrumbs + SectionHeader + letter jump nav + per-letter
// link columns.
export default function Loading(): JSX.Element {
  return (
    <MainLayout>
      <div className="container px-4 pt-4">
        <div className="skeleton h-4 w-40 rounded-sm" />
      </div>
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20" aria-label="Memuat indeks A–Z">
        <div className="skeleton h-3 w-28 rounded-sm" />
        <div className="skeleton mt-3 h-8 w-64 max-w-full rounded-sm" />
        <div className="skeleton mt-3 h-4 w-full max-w-2xl rounded" />
        <div className="mt-6 flex flex-wrap gap-1.5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="skeleton h-9 w-9 rounded-sm" />
          ))}
        </div>
        <div className="mt-8 space-y-8">
          {Array.from({ length: 3 }).map((_, group) => (
            <div key={group} className="card-shell">
              <div className="card-core p-5 sm:p-6">
                <div className="skeleton h-8 w-10 rounded-sm" />
                <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, row) => (
                    <div key={row} className="skeleton h-4 w-4/5 rounded" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
