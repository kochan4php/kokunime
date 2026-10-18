import SectionDetail from "@/components/anime/section-detail";
import ViewTracker from "@/components/view-tracker";
import RecommendationSection from "@/sections/recommendation-section";
import SimilarAnime from "@/sections/similar-anime";
import SeasonRail from "@/sections/season-rail";
import { endpointSlug } from "@/utils/endpoint-slug";
import { getAnimeDetail } from "@/services/scraper";
import { buildAnimeJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd, safeJsonLd } from "@/lib/seo";
import { buildDetailMetadata } from "@/lib/detail-metadata";
import MainLayout from "@/layouts/main-layout";
import RailSkeleton from "@/components/cards/rail-skeleton";
import { AnimeDetail } from "@/interfaces";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { JSX, Suspense } from "react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return buildDetailMetadata(params);
}

// On-demand ISR: the empty param list means nothing is prerendered at build
// (a flaky upstream during `next build` can never bake an empty detail page);
// every slug renders on first request, then is served from cache for 5 min.
// Data freshness is still bounded by the unstable_cache TTLs.
export const revalidate = 300;

export function generateStaticParams(): { slug: string }[] {
  return [];
}

// Below-fold rails resolve after the main content: stream them behind a
// skeleton so a slow upstream season listing can never hold back the hero,
// synopsis, and download links the page exists for.
const Anime = async ({ params }: { params: Promise<{ slug: string }> }): Promise<JSX.Element> => {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug).trim();
  const normalized = decoded.toLowerCase();

  if (slug !== normalized && /^[a-z0-9-]+$/i.test(decoded)) {
    permanentRedirect(`/anime/${normalized}`);
  }

  const anime: AnimeDetail | null = await getAnimeDetail(slug);

  if (!anime?.title) {
    notFound();
  }

  const seasonSlug = anime.season?.endpoint ? endpointSlug(anime.season.endpoint, "seasons") : null;

  return (
    <MainLayout>
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(buildBreadcrumbJsonLd(anime.title ?? "Anime", slug)) }}
        suppressHydrationWarning
      />
      <script
        id="anime-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(buildAnimeJsonLd(anime, slug)) }}
        suppressHydrationWarning
      />
      <script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(buildFaqJsonLd(anime)) }}
        suppressHydrationWarning
      />
      <ViewTracker slug={slug} />
      <SectionDetail anime={anime} slug={slug} />
      <Suspense fallback={<RailSkeleton />}>
        <SimilarAnime slug={slug} title={anime.title ?? ""} />
      </Suspense>
      {seasonSlug ? (
        <Suspense fallback={<RailSkeleton />}>
          <SeasonRail seasonSlug={seasonSlug} seasonName={anime.season?.name} excludeSlug={slug} />
        </Suspense>
      ) : null}
      <div className="mt-8 border-t-2 border-border pt-12">
        <RecommendationSection />
      </div>
    </MainLayout>
  );
};

export default Anime;
