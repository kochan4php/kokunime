import { renderOgCard } from "@/lib/og-card";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Kokunime — Katalog Anime per Halaman";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// One OG card per catalog page: /page/2, /page/3, … (falls back to the plain
// card for anything non-numeric).
export default async function Image({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNumber = Number(page);

  return new ImageResponse(
    renderOgCard({
      badge: Number.isFinite(pageNumber) && pageNumber > 1 ? `Halaman ${pageNumber}` : "Katalog",
      title: "Katalog Anime Subtitle Indonesia",
      subtitle:
        Number.isFinite(pageNumber) && pageNumber > 1
          ? `Lanjutan daftar download batch & episode — halaman ${pageNumber}.`
          : "Subtitle Indonesia · Kualitas 360p–1080p · Update tiap hari",
    }),
    { ...size },
  );
}
