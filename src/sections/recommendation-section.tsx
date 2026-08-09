import RecommendedAnime from "@/sections/recommended-anime";
import RecommendedSkeleton from "@/components/recommended-skeleton";
import Reveal from "@/components/reveal";
import { JSX, Suspense } from "react";

const RecommendationSection = (): JSX.Element => (
  <section id="recommendations" className="container scroll-mt-28 px-4 pb-16 md:pb-24">
    <Reveal>
      <div className="mb-6 flex items-center gap-4">
        <span className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-amber" />
          Rekomendasi
        </span>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Rekomendasi Anime</h2>
      </div>
    </Reveal>
    <Suspense fallback={<RecommendedSkeleton />}>
      <RecommendedAnime />
    </Suspense>
  </section>
);

export default RecommendationSection;
