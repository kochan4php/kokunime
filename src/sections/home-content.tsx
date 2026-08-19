import FeaturedHero from "@/sections/featured-hero";
import LatestGrid from "@/sections/latest-grid";
import RecommendationSection from "@/sections/recommendation-section";
import HomeHistoryStrip from "@/components/home-history-strip";
import { getAnimePerPage } from "@/services/scraper";
import { JSX } from "react";

const HomeContent = async ({ page, basePath }: { page: number; basePath?: string }): Promise<JSX.Element> => {
  const { anime = [], pagination } = await getAnimePerPage(page);

  return (
    <>
      <section className="container px-4 pt-6 md:pt-10">
        <FeaturedHero featured={anime[0]} items={anime} />
      </section>
      <HomeHistoryStrip />
      <LatestGrid anime={anime} pagination={pagination} basePath={basePath} />
      <RecommendationSection />
    </>
  );
};

export default HomeContent;
