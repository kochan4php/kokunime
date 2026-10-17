import FeaturedHero from "@/sections/featured-hero";
import LatestGrid from "@/sections/latest-grid";
import RecommendationSection from "@/sections/recommendation-section";
import HomeHistoryStrip from "@/components/home-history-strip";
import ReleaseWatcher from "@/components/release-watcher";
import { getBlurDataUrl } from "@/lib/blur";
import { getAnimePerPage } from "@/services/scraper";
import { animeSlug } from "@/utils/endpoint-slug";
import { JSX } from "react";

interface HomeSectionProps {
  page: number;
  basePath?: string;
}

// Split into two async sections so the hero and the catalog grid each stream
// inside their own Suspense boundary (see app/page.tsx). Both await the same
// cached upstream call, so the cache single-flight dedupes the fetch.
export const HomeHeroSection = async (): Promise<JSX.Element> => {
  const { anime = [] } = await getAnimePerPage(1);
  const blurDataURL = await getBlurDataUrl(anime[0]?.link?.image);

  return (
    <>
      <section className="container px-4 pt-6 md:pt-10">
        <FeaturedHero featured={anime[0]} items={anime} blurDataURL={blurDataURL} />
      </section>
      <HomeHistoryStrip />
    </>
  );
};

export const HomeLatestSection = async ({ page, basePath }: HomeSectionProps): Promise<JSX.Element> => {
  const { anime = [], pagination } = await getAnimePerPage(page);
  const releaseItems = anime
    .map((item) => ({ slug: animeSlug(item?.link?.endpoint), title: item.title ?? "", release: item.release }))
    .filter((item) => Boolean(item.slug));
  return (
    <>
      <ReleaseWatcher items={releaseItems} />
      <LatestGrid anime={anime} pagination={pagination} basePath={basePath} />
    </>
  );
};

const HomeContent = async ({ page, basePath }: HomeSectionProps): Promise<JSX.Element> => (
  <>
    <HomeHeroSection />
    <HomeLatestSection page={page} basePath={basePath} />
    <RecommendationSection />
  </>
);

export default HomeContent;
