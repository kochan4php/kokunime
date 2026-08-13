import SectionDetail from "@/components/anime/section-detail";
import { loadAnimeDetail } from "@/lib/loaders";
import { buildAnimeJsonLd, buildBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import { buildDetailMetadata } from "@/lib/detail-metadata";
import MainLayout from "@/layouts/main-layout";
import { getAnimePerPage } from "@/services/scraper";
import { AnimeDetail } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JSX } from "react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return buildDetailMetadata(params);
}

export const revalidate = 900;

// Prerender the detail pages whose slugs are already crawled for the sitemap
// (list pages 1-10, bounded — the same crawl the sitemap does). Known pages
// become static CDN-served HTML (~40ms TTFB instead of a serverless render);
// unknown slugs stay dynamic (dynamicParams defaults to true) and 404.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = new Set<string>();
  for (let page = 1; page <= 10; page++) {
    const { anime = [] } = await getAnimePerPage(page);
    for (const item of anime) {
      const endpoint = animeSlug(item?.link?.endpoint);
      if (endpoint) slugs.add(endpoint);
    }
  }
  // Verify each slug resolves before prerendering — a detail fetch that
  // 404s mid-build would otherwise fail the whole build. The fetch is
  // unstable_cache'd, so the page prerender that follows hits the same
  // cache (no extra upstream cost). Unverifiable slugs stay dynamic.
  const verified = await Promise.all([...slugs].map(async (slug) => ({ slug, ok: !!(await loadAnimeDetail(slug)) })));
  return verified.filter((item) => item.ok).map((item) => ({ slug: item.slug }));
}

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
