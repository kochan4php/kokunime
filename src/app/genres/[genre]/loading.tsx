import CardSkeleton from "@/components/card-skeleton";
import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

const GenreLoading = (): JSX.Element => (
  <MainLayout>
    <section className="container px-4 py-12 md:py-20" aria-label="Memuat anime per genre">
      <div className="skeleton h-3 w-24 rounded-full" />
      <div className="skeleton mt-3 h-8 w-56 rounded-lg" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </section>
  </MainLayout>
);

export default GenreLoading;
