import { renderOgCard } from "@/lib/og-card";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Statistik Nonton — jam tonton, streak, rating dan genre";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    renderOgCard({
      badge: "Statistik",
      title: "Statistik Nonton Kamu",
      subtitle: "Jam tonton, streak, rating, dan genre favorit",
    }),
    { ...size },
  );
}
