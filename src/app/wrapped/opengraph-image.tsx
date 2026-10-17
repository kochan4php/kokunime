import { renderOgCard } from "@/lib/og-card";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Kokunime Wrapped — Rekap tontonan tahunan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    renderOgCard({
      badge: "Wrapped",
      title: "Kokunime Wrapped",
      subtitle: "Rekap tontonan dan streak kamu",
    }),
    { ...size },
  );
}
