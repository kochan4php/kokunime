import AnimeListing from "@/sections/anime-listing";
import Breadcrumbs from "@/components/breadcrumbs";
import MainLayout from "@/layouts/main-layout";
import { Anime } from "@/interfaces";
import { searchAnime } from "@/services/scraper";
import { decodeStudioName } from "@/lib/studio";
import { SITE_URL } from "@/lib/site";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JSX } from "react";

// Search-backed studio view: the upstream catalog has no studio index, so the
// page runs a catalog search on the studio name and labels the result honestly.
export const revalidate = 3600;

export function generateStaticParams(): { name: string }[] {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const studio = decodeStudioName(name);
  if (!studio) return { title: "Studio tidak ditemukan" };

  const canonical = `/studio/${encodeURIComponent(studio)}`;
  return {
    title: `Anime Studio ${studio}`,
    description: `Judul-judul katalog Kokunime yang cocok dengan studio ${studio}, lengkap dengan link download batch subtitle Indonesia.`,
    alternates: {
      canonical,
      types: { "application/rss+xml": `${canonical}/feed.xml` },
    },
    openGraph: {
      title: `Anime Studio ${studio} · Kokunime`,
      description: `Hasil katalog untuk studio ${studio}.`,
      url: `${SITE_URL}${canonical}`,
    },
  };
}

const StudioPage = async ({ params }: { params: Promise<{ name: string }> }): Promise<JSX.Element> => {
  const { name } = await params;
  const studio = decodeStudioName(name);
  if (!studio) notFound();

  const anime: Anime[] = await searchAnime(studio);

  return (
    <MainLayout>
      {anime.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(buildSubpageBreadcrumbJsonLd([{ name: `Studio ${studio}`, url: `/studio/${studio}` }])),
          }}
        />
      )}
      <Breadcrumbs items={[{ name: "Studio" }, { name: studio }]} />
      <AnimeListing chip="Studio" title={`Studio ${studio}`} anime={anime} pagination={null} eagerCount={4} />
      <p className="container -mt-8 px-4 pb-12 text-xs text-ink-muted md:pb-20">
        Catatan: katalog tidak menyediakan indeks studio resmi, jadi daftar ini berasal dari pencocokan nama studio ke
        judul di katalog.
      </p>
    </MainLayout>
  );
};

export default StudioPage;
