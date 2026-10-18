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
  basePath?: string | undefined;
}

// Split into two async sections so the hero and the catalog grid each stream
// inside their own Suspense boundary (see app/page.tsx). Both await the same
// cached upstream call, so the cache single-flight dedupes the fetch.
export const HomeHeroSection = async (): Promise<JSX.Element> => {
  const { anime = [], pagination } = await getAnimePerPage(1);
  const blurDataURL = await getBlurDataUrl(anime[0]?.link?.image);
  const edition = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <section className="container px-4 pt-6 md:pt-10">
        {/* Masthead: edition date + real catalog size, magazine style. */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-2 border-border bg-surface-solid px-3.5 py-2 shadow-[3px_3px_0_0_var(--border)]">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink">Edisi {edition}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
            {pagination?.total_page ? `${pagination.total_page} halaman katalog` : "Katalog"} · batch + episode · sub
            indo
          </p>
        </div>

        <div className="mt-5">
          <FeaturedHero featured={anime[0]} items={anime} blurDataURL={blurDataURL} />
        </div>
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
