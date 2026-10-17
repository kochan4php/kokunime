import { renderOgCard } from "@/lib/og-card";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Kokunime — Download Anime Subtitle Indonesia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    renderOgCard({
      badge: "Sub Indo",
      title: "Download Anime Batch & Episode",
      subtitle: "Subtitle Indonesia · Kualitas 360p–1080p · Update tiap hari",
    }),
    { ...size },
  );
}
