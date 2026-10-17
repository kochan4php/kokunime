import type { ReactElement } from "react";

interface OgCardOptions {
  badge: string;
  title: string;
  subtitle?: string;
}

// Shared neobrutalist card for the route-level opengraph-image files.
// ImageResponse (satori) supports flexbox + boxShadow only — every container
// that holds more than one child must be display:flex.
export function renderOgCard({ badge, title, subtitle }: OgCardOptions): ReactElement {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fdf5eb",
        color: "#0a0a0a",
        padding: "64px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: 90,
          width: 150,
          height: 150,
          backgroundColor: "#f7c948",
          border: "4px solid #0a0a0a",
          transform: "rotate(12deg)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -40,
          width: 190,
          height: 190,
          borderRadius: 9999,
          backgroundColor: "#59d3c6",
          border: "4px solid #0a0a0a",
          display: "flex",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            display: "flex",
            backgroundColor: "#e05a36",
            color: "#ffffff",
            border: "4px solid #0a0a0a",
            boxShadow: "6px 6px 0 #0a0a0a",
            padding: "10px 26px",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          {badge}
        </div>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 4 }}>KOKUNIME</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 980 }}>
        <div style={{ display: "flex", fontSize: 66, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        {subtitle ? <div style={{ display: "flex", fontSize: 28, color: "#4b4b4b" }}>{subtitle}</div> : null}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{ display: "flex", width: 20, height: 20, backgroundColor: "#e05a36", border: "4px solid #0a0a0a" }}
        />
        <div style={{ display: "flex", fontSize: 22, color: "#4b4b4b" }}>Batch &amp; episode · Subtitle Indonesia</div>
      </div>
    </div>
  );
}
