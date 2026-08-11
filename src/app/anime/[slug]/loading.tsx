import DetailSkeleton from "@/components/anime/detail-skeleton";
import NewSeriesSkeleton from "@/components/anime/new-series-skeleton";
import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

const AnimeLoading = (): JSX.Element => (
  <MainLayout>
    <section className="container px-4 pb-8 pt-12 md:pb-12 md:pt-16" aria-label="Memuat detail anime">
      <DetailSkeleton />
      <div className="mt-20">
        <div className="mb-6 flex items-center gap-4">
          <div className="skeleton h-3 w-24 rounded-full" />
          <div className="skeleton h-7 w-40 rounded-lg" />
        </div>
        <NewSeriesSkeleton />
      </div>
    </section>
  </MainLayout>
);

export default AnimeLoading;
