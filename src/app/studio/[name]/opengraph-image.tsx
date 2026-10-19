import { renderOgCard } from "@/lib/og-card";
import { decodeStudioName } from "@/lib/studio";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Kokunime — Anime per Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const studio = decodeStudioName(name) || "Studio";

  return new ImageResponse(
    renderOgCard({
      badge: "Studio",
      title: `Anime Studio ${studio}`,
      subtitle: "Katalog Kokunime, subtitle Indonesia",
    }),
    { ...size },
  );
}
