import { renderOgCard } from "@/lib/og-card";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Update Anime Terbaru — Kokunime";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    renderOgCard({
      badge: "Update",
      title: "Rilis Anime Terbaru",
      subtitle: "Batch & episode sub Indo · diperbarui tiap hari",
    }),
    { ...size },
  );
}
