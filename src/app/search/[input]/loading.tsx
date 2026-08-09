import CardSkeleton from "@/components/CardSkeleton";
import MainLayout from "@/layouts/MainLayout";
import { JSX } from "react";

const SearchLoading = (): JSX.Element => (
  <MainLayout>
    <section className="container px-4 py-12 md:py-20" aria-label="Memuat hasil pencarian">
      <div className="space-y-3">
        <div className="skeleton h-3 w-32 rounded-full" />
        <div className="skeleton h-9 w-64 rounded-lg" />
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </section>
  </MainLayout>
);

export default SearchLoading;
