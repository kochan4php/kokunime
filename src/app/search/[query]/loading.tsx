import GridSkeleton from "@/components/cards/grid-skeleton";
import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

// Mirrors /search/[query]: SectionHeader + SearchResults (control row + grid).
export default function Loading(): JSX.Element {
  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16" aria-label="Memuat hasil pencarian">
        <div className="skeleton h-3 w-28 rounded-sm" />
        <div className="skeleton mt-3 h-8 w-64 max-w-full rounded-sm" />
        <div className="skeleton mt-3 h-4 w-full max-w-2xl rounded" />
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="skeleton h-10 w-20 rounded-sm" />
          <div className="skeleton h-10 w-32 rounded-sm" />
          <div className="skeleton h-10 w-28 rounded-sm" />
        </div>
        <div className="mt-6">
          <GridSkeleton count={10} />
        </div>
      </section>
    </MainLayout>
  );
}
