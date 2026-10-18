import RecommendedAnime from "@/sections/recommended-anime";
import RecommendedSkeleton from "@/components/cards/recommended-skeleton";
import Reveal from "@/components/reveal";
import SectionHeader from "@/components/section-header";
import { JSX, Suspense } from "react";

const RecommendationSection = (): JSX.Element => (
  <section id="recommendations" className="container scroll-mt-28 px-4 pb-16 md:pb-20">
    <Reveal>
      <SectionHeader kicker="Rekomendasi" title="Rekomendasi Anime" tone="purple" className="mb-6" />
    </Reveal>
    <Suspense fallback={<RecommendedSkeleton />}>
      <RecommendedAnime />
    </Suspense>
  </section>
);

export default RecommendationSection;
