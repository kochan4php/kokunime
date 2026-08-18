import { getAnimeDetail } from "@/services/scraper";
import { truncate } from "@/utils/truncate";
import { SITE_URL } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function buildDetailMetadata(params: Promise<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const anime = await getAnimeDetail(slug);

  if (!anime?.title) {
    notFound();
  }

  const title = anime.title;
  const genreNames = anime.genre?.map((g) => g.name).slice(0, 3).join(", ");
  const contextualDetails = [
    anime.score ? `Skor: ${anime.score}` : "",
    anime.total_episode ? `Total: ${anime.total_episode}` : "",
    genreNames ? `Genre: ${genreNames}` : "",
    anime.producer ? `Studio: ${anime.producer}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  const description = contextualDetails
    ? `Download batch ${title} Sub Indo (${contextualDetails}). ${truncate(anime.synopsis, 100)}`
    : truncate(anime.synopsis, 160) || `Download batch anime ${title} Subtitle Indonesia lengkap kualitas 360p, 480p, 720p, 1080p di Kokunime.`;
  const images = anime.image ? [{ url: anime.image, alt: title }] : [];

  return {
    title,
    description,
    alternates: {
      canonical: `/anime/${slug}`,
      languages: { "id-ID": `/anime/${slug}`, "x-default": `/anime/${slug}` },
    },
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
