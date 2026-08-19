import SectionDetail from "@/components/anime/section-detail";
import RecommendationSection from "@/sections/recommendation-section";
import { getAnimeDetail } from "@/services/scraper";
import { buildAnimeJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd, safeJsonLd } from "@/lib/seo";
import { buildDetailMetadata } from "@/lib/detail-metadata";
import MainLayout from "@/layouts/main-layout";
import { AnimeDetail } from "@/interfaces";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { JSX } from "react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return buildDetailMetadata(params);
}

// Fully dynamic: upstream data (download links, synopsis, recommendations)
// changes constantly, so a build-time static page would serve stale content
// until the next deploy. Every request renders fresh; the upstream fetch is
// still deduped by unstable_cache (15m TTL in cache.ts).
export const dynamic = "force-dynamic";

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
      <SectionDetail anime={anime} slug={slug} />
      <div className="mt-8 border-t border-border pt-12">
        <RecommendationSection />
      </div>
    </MainLayout>
  );
};

export default Anime;
