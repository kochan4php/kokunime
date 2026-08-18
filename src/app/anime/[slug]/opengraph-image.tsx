/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getAnimeDetail } from "@/services/scraper";

export const runtime = "nodejs";
export const alt = "Kokunime Anime Detail";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const anime = await getAnimeDetail(slug);

  const title = anime?.title || "Kokunime Anime";
  const score = anime?.score ? `⭐ Skor: ${anime.score}` : "⭐ Skor: N/A";
  const release = anime?.release_on ? `📅 ${anime.release_on}` : "📅 Subtitle Indonesia";
  const image = anime?.image || "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#18110e",
          color: "#fdf5eb",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            width: "660px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                backgroundColor: "#e05a36",
                color: "#ffffff",
                padding: "6px 16px",
                borderRadius: "9999px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Kokunime
            </div>
            <div style={{ fontSize: "18px", color: "#a89b91" }}>· Download Anime Sub Indo</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                fontSize: "40px",
                fontWeight: "800",
                lineHeight: "1.15",
                color: "#ffffff",
                display: "-webkit-box",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </div>
            <div style={{ display: "flex", gap: "16px", fontSize: "20px", color: "#e8c582" }}>
              <span>{score}</span>
              <span>{release}</span>
            </div>
          </div>

          <div
            style={{
              fontSize: "16px",
              color: "#a89b91",
            }}
          >
            kokunime.netlify.app · Batch &amp; Episode Lengkap
          </div>
        </div>

        {image ? (
          <img
            src={image}
            alt={title}
            style={{
              width: "360px",
              height: "480px",
              borderRadius: "24px",
              objectFit: "cover",
              border: "2px solid rgba(224, 90, 54, 0.4)",
            }}
          />
        ) : null}
      </div>
    ),
    { ...size },
  );
}
