import { loadAnimeDetail } from "@/lib/loaders";
import { truncate } from "@/utils/truncate";
import { SITE_URL } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function buildDetailMetadata(params: Promise<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const anime = await loadAnimeDetail(slug);

  if (!anime?.title) {
    notFound();
  }

  const title = anime.title;
  const description = truncate(anime.synopsis, 160);
  const images = anime.image ? [{ url: anime.image, alt: title }] : [];

  return {
    title,
    description,
    alternates: { canonical: `/anime/${slug}` },
    openGraph: {
      type: "video.tv_show",
      title,
      description,
      url: `${SITE_URL}/anime/${slug}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}
