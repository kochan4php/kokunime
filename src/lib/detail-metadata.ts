import { loadAnimeDetail } from "@/lib/loaders";
import { truncate } from "@/utils/truncate";
import { Metadata } from "next";

export async function buildDetailMetadata(params: any): Promise<Metadata> {
  const { slug } = await params;
  const anime = await loadAnimeDetail(slug);
  const title = anime.title ?? "Detail Anime";
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
