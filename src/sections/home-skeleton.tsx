import RecommendedSkeleton from "@/components/cards/recommended-skeleton";
import { SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import ListingSkeleton from "@/sections/listing-skeleton";
import { JSX } from "react";

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

// Home streams three blocks: hero (masthead + featured), latest grid and the
// recommendation rail. Reusing the listing skeleton keeps the grid geometry
// identical when the real HomeContent swaps in.
const HomeSkeleton = (): JSX.Element => (
  <div role="status" aria-label="Memuat halaman">
    <HeroSkeleton />
    <ListingSkeleton className="py-16 md:py-24" />
    <div className="container px-4 pb-16 md:pb-20">
      <SectionHeaderSkeleton titleWidth="w-56" description={false} className="mb-6" />
      <RecommendedSkeleton />
    </div>
  </div>
);

export default HomeSkeleton;
