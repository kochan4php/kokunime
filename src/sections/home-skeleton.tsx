import GridSkeleton from "@/components/cards/grid-skeleton";
import RecommendedSkeleton from "@/components/recommended-skeleton";
import { JSX } from "react";

const HomeSkeleton = (): JSX.Element => (
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
      <GridSkeleton count={10} />
    </div>
    <div className="pb-8 md:pb-16">
      <div className="mb-6 flex items-center gap-4">
        <div className="skeleton h-3 w-28 rounded-full" />
        <div className="skeleton h-7 w-48 rounded-lg" />
      </div>
      <RecommendedSkeleton />
    </div>
  </section>
);

export default HomeSkeleton;
