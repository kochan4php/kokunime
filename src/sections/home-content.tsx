import FeaturedHero from "@/sections/featured-hero";
import LatestGrid from "@/sections/latest-grid";
import RecommendationSection from "@/sections/recommendation-section";
import { loadAnimePage } from "@/lib/loaders";
import { JSX } from "react";

const HomeContent = async ({ page }: { page: number }): Promise<JSX.Element> => {
  const { anime = [], pagination } = await loadAnimePage(page);

  return (
    <>
      <section className="container px-4 pt-6 md:pt-10">
        <FeaturedHero featured={anime[0]} />
      </section>
      <LatestGrid anime={anime} pagination={pagination} />
      <RecommendationSection />
    </>
  );
};

export default HomeContent;
