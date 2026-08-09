import CardSkeleton from "@/components/CardSkeleton";
import MainLayout from "@/layouts/MainLayout";
import { JSX } from "react";

const Loading = (): JSX.Element => (
  <MainLayout>
    <section className="container px-4 pb-16 pt-6 md:pt-10" aria-label="Memuat halaman">
      <div className="card-shell">
        <div className="card-core">
          <div className="grid md:grid-cols-2">
            <div className="skeleton aspect-[16/10] md:aspect-auto md:min-h-[26rem]" />
            <div className="flex flex-col justify-center gap-4 p-7 md:p-12">
              <div className="skeleton h-3 w-24 rounded-full" />
              <div className="skeleton h-8 w-3/4 rounded-lg md:h-12" />
              <div className="skeleton h-4 w-1/2 rounded-lg" />
              <div className="skeleton h-11 w-44 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="py-16 md:py-24">
        <div className="mb-8 space-y-3">
          <div className="skeleton h-3 w-28 rounded-full" />
          <div className="skeleton h-7 w-48 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  </MainLayout>
);

export default Loading;
