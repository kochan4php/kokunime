import SectionDetail from "@/components/anime/section-detail";
import { loadAnimeDetail } from "@/lib/loaders";
import { buildAnimeJsonLd, buildBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import { buildDetailMetadata } from "@/lib/detail-metadata";
import MainLayout from "@/layouts/main-layout";
import { AnimeDetail } from "@/interfaces";
import { Metadata } from "next";
import { notFound } from "next/navigation";
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
  const anime: AnimeDetail | null = await loadAnimeDetail(slug);

  if (!anime?.title) {
    notFound();
  }

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(buildBreadcrumbJsonLd(anime.title ?? "Anime", slug)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(buildAnimeJsonLd(anime, slug)) }}
      />
      <SectionDetail anime={anime} slug={slug} />
    </MainLayout>
  );
};

export default Anime;
