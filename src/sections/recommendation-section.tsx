import RecommendedAnime from "@/sections/recommended-anime";
import RecommendedSkeleton from "@/components/cards/recommended-skeleton";
import Reveal from "@/components/reveal";
import SectionHeader from "@/components/section-header";
import { JSX, Suspense } from "react";

// Full-bleed yellow band: the recommendation shelf is a different "chapter" of
// the front page, so it gets its own colour block instead of another cream row.
const RecommendationSection = (): JSX.Element => (
  <section id="recommendations" className="nb-band nb-band-yellow scroll-mt-28">
    <div className="container px-4 py-14 md:py-20">
      <Reveal>
        <SectionHeader kicker="Rekomendasi" title="Rekomendasi Anime" tone="pink" className="mb-6" />
      </Reveal>
      <Suspense fallback={<RecommendedSkeleton />}>
        <RecommendedAnime />
      </Suspense>
    </div>
  </section>
);

export default RecommendationSection;
