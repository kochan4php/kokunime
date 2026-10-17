import { renderOgCard } from "@/lib/og-card";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Roulette Anime — putar dan temukan tontonan berikutnya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    renderOgCard({
      badge: "Roulette",
      title: "Roulette Anime",
      subtitle: "Putar dan temukan tontonan berikutnya",
    }),
    { ...size },
  );
}
