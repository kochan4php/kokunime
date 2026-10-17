import { renderOgCard } from "@/lib/og-card";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Bandingkan Anime — Kokunime";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    renderOgCard({
      badge: "Compare",
      title: "Bandingkan Dua Anime",
      subtitle: "Skor, genre, studio, dan link download side-by-side",
    }),
    { ...size },
  );
}
