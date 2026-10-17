import { renderOgCard } from "@/lib/og-card";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Kokunime — Anime per Tahun";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const YEAR_RE = /^(19|20)\d{2}$/;

export default async function Image({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const safeYear = YEAR_RE.test(year) ? year : "Anime";

  return new ImageResponse(
    renderOgCard({
      badge: "Tahun",
      title: `Anime Rilis ${safeYear}`,
      subtitle: "Arsip anime per tahun, sub Indo lengkap",
    }),
    { ...size },
  );
}
