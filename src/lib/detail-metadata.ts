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
  const genreNames = anime.genre
    ?.map((g) => g.name)
    .slice(0, 3)
    .join(", ");
  const contextualDetails = [
    anime.score ? `Skor: ${anime.score}` : "",
    anime.total_episode ? `Total: ${anime.total_episode}` : "",
    genreNames ? `Genre: ${genreNames}` : "",
    anime.producer ? `Studio: ${anime.producer}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  const description = truncate(
    contextualDetails
      ? `Download batch ${title} Sub Indo (${contextualDetails}). ${truncate(anime.synopsis, 100)}`
      : truncate(anime.synopsis, 160) ||
          `Download batch anime ${title} Subtitle Indonesia lengkap kualitas 360p, 480p, 720p, 1080p di Kokunime.`,
    160,
  );
  const images = anime.image ? [{ url: anime.image, alt: title }] : [];

  return {
    // Long upstream names skip the "· Kokunime" template instead of being
    // chopped into a SERP ellipsis.
    title: title.length > 54 ? { absolute: title } : title,
    description,
    alternates: {
      canonical: `/anime/${slug}`,
      languages: { "id-ID": `/anime/${slug}`, "x-default": `/anime/${slug}` },
    },
    // OG deliberately omits `images`: the file convention
    // (anime/[slug]/opengraph-image.tsx) serves a 1200×630 card with declared
    // dimensions, while the raw upstream poster ships none. Twitter keeps the
    // poster — its crawler reads a single image and dims are not required.
    openGraph: {
      type: "video.tv_show",
      title,
      description,
      url: `${SITE_URL}/anime/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}
