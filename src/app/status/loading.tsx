import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

// Mirrors /status: SectionHeader + three rollup cards + daily history rows.
export default function Loading(): JSX.Element {
  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16" aria-label="Memuat status layanan">
        <div className="skeleton h-3 w-24 rounded-sm" />
        <div className="skeleton mt-3 h-8 w-64 max-w-full rounded-sm" />
        <div className="skeleton mt-3 h-4 w-full max-w-2xl rounded" />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="card-shell">
              <div className="card-core p-4">
                <div className="skeleton h-3 w-24 rounded-sm" />
                <div className="skeleton mt-2 h-7 w-20 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
        <div className="skeleton mt-8 h-6 w-36 rounded-sm" />
        <div className="mt-3 space-y-1.5">
          {Array.from({ length: 8 }).map((_, row) => (
            <div key={row} className="skeleton h-9 rounded-sm" />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
