import SectionDetail from "@/components/anime/section-detail";
import { getAnimeDetail } from "@/lib/api-client";
import { buildAnimeJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { buildDetailMetadata } from "@/lib/detail-metadata";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX } from "react";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  return buildDetailMetadata(params);
}

const Anime = async (props: any): Promise<JSX.Element> => {
  const { slug } = (await props.params) ?? "";
  const anime: any = await getAnimeDetail(slug);

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(anime.title, slug)) }}
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
