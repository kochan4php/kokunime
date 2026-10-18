import GridSkeleton from "@/components/cards/grid-skeleton";
import RecommendedSkeleton from "@/components/cards/recommended-skeleton";
import { JSX } from "react";

const HomeSkeleton = (): JSX.Element => (
  <section className="container px-4 pb-16 pt-6 md:pt-10" aria-label="Memuat halaman">
    <div className="card-shell">
      <div className="card-core">
        <div className="grid md:grid-cols-2">
          <div className="skeleton aspect-[16/10] md:aspect-auto md:min-h-[26rem]" />
          <div className="flex flex-col justify-center gap-4 p-7 md:p-12">
            <div className="skeleton h-3 w-24 rounded-sm" />
            <div className="skeleton h-8 w-3/4 rounded-sm md:h-12" />
            <div className="skeleton h-4 w-1/2 rounded-sm" />
            <div className="skeleton h-11 w-44 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
    <div className="py-16 md:py-24">
      <div className="mb-8 space-y-3">
        <div className="skeleton h-3 w-28 rounded-sm" />
        <div className="skeleton h-7 w-48 rounded-sm" />
      </div>
      <GridSkeleton count={10} />
    </div>
    <div className="pb-8 md:pb-16">
      <div className="mb-6 flex items-center gap-4">
        <div className="skeleton h-3 w-28 rounded-sm" />
        <div className="skeleton h-7 w-48 rounded-sm" />
      </div>
      <RecommendedSkeleton />
    </div>
  </section>
);

// Sized to the real HomeHeroSection (masthead bar + FeaturedHero) so streaming
// it in does not reflow the page below — CLS counts this swap.
export const HeroSkeleton = (): JSX.Element => (
  <section className="container px-4 pt-6 md:pt-10" aria-label="Memuat unggulan">
    <div className="skeleton h-[34px] w-full" />
    <div className="mt-5 card-shell">
      <div className="card-core">
        <div className="grid md:grid-cols-2">
          <div className="skeleton aspect-[16/10] md:aspect-auto md:min-h-[26rem]" />
          <div className="flex min-w-0 flex-col justify-center gap-3 p-5 sm:gap-4 sm:p-8 md:p-12">
            <div className="skeleton h-[5.5rem] w-3/4 rounded-sm sm:h-[7.1rem] md:h-[11.8rem]" />
            <div className="skeleton h-[2.75rem] w-40 rounded-sm" />
            <div className="skeleton mt-2 h-11 w-44 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HomeSkeleton;
