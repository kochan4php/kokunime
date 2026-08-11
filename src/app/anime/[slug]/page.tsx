import SectionDetail from "@/components/anime/section-detail";
import ScrollToTop from "@/components/scroll-to-top";
import { loadAnimeDetail } from "@/lib/loaders";
import { buildAnimeJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { buildDetailMetadata } from "@/lib/detail-metadata";
import MainLayout from "@/layouts/main-layout";
import { AnimeDetail } from "@/interfaces";
import { Metadata } from "next";
import { JSX } from "react";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  return buildDetailMetadata(params);
}

const Anime = async (props: any): Promise<JSX.Element> => {
  const { slug } = (await props.params) ?? "";
  const anime: AnimeDetail = await loadAnimeDetail(slug);

  return (
    <MainLayout>
      <ScrollToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(anime.title ?? "Anime", slug)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildAnimeJsonLd(anime, slug)) }}
      />
      <SectionDetail anime={anime} slug={slug} />
    </MainLayout>
  );
};

export default Anime;
