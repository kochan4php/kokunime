import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

// Mirrors /genres: SectionHeader + GenresExplorer (search bar + genre tiles).
export default function Loading(): JSX.Element {
  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20" aria-label="Memuat daftar genre">
        <div className="skeleton h-3 w-24 rounded-sm" />
        <div className="skeleton mt-3 h-8 w-64 max-w-full rounded-sm" />
        <div className="skeleton mt-3 h-4 w-full max-w-2xl rounded" />
        <div className="mt-8 space-y-8">
          <div className="skeleton h-12 w-full max-w-md rounded-sm" />
          <div className="skeleton h-4 w-44 rounded-sm" />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="skeleton h-28 rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
