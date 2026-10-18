import HomeSkeleton, { HeroSkeleton } from "@/sections/home-skeleton";
import ListingSkeleton from "@/sections/listing-skeleton";
import { HomeHeroSection, HomeLatestSection } from "@/sections/home-content";
import RecommendationSection from "@/sections/recommendation-section";
import RecommendForYou from "@/components/recommend-for-you";
import TrendingRail from "@/components/trending-rail";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX, Suspense } from "react";

// Dynamic: featured/recommended/latest-series data changes constantly on the
// upstream — a build-time static home would show stale picks until deploy.
// unstable_cache (cache.ts) still dedupes the upstream fetches (15-30m TTL).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Download Anime Subtitle Indonesia · Kokunime",
    description: "Kumpulan link download anime batch dan episode, semua dengan subtitle Indonesia.",
    alternates: { canonical: "/", languages: { "id-ID": "/" } },
  };
}

const Home = async (): Promise<JSX.Element> => {
  return (
    <MainLayout>
      {/* Per-section Suspense: hero streams first, the catalog grid and the
          recommendation rails fill in as their data resolves. */}
      <Suspense fallback={<HeroSkeleton />}>
        <HomeHeroSection />
      </Suspense>
      <TrendingRail />
      <Suspense fallback={<ListingSkeleton />}>
        <HomeLatestSection page={1} basePath="/page" />
      </Suspense>
      <RecommendationSection />
      <RecommendForYou />
    </MainLayout>
  );
};

export default Home;
