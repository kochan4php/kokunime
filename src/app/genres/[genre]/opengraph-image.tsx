import { renderOgCard } from "@/lib/og-card";
import { toTitle } from "@/utils/to-title";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Kokunime — Koleksi Anime per Genre";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ genre: string }> }) {
  const { genre } = await params;
  const title = toTitle(decodeURIComponent(genre));

  return new ImageResponse(
    renderOgCard({
      badge: "Genre",
      title: `Anime Genre ${title}`,
      subtitle: "Koleksi lengkap sub Indo untuk genre ini",
    }),
    { ...size },
  );
}
