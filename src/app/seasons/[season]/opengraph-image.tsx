import { renderOgCard } from "@/lib/og-card";
import { toTitle } from "@/utils/to-title";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Kokunime — Anime per Musim";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ season: string }> }) {
  const { season } = await params;
  const title = toTitle(decodeURIComponent(season));

  return new ImageResponse(
    renderOgCard({
      badge: "Musim",
      title: `Anime Musim ${title}`,
      subtitle: "Semua rilisan musim ini, batch & episode",
    }),
    { ...size },
  );
}
