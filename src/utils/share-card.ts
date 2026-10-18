// Canvas share cards (Wrapped, perbandingan, folder): drawn locally, no deps.
// Neobrutalist palette mirrors the site tokens.

interface ShareCardRow {
  label: string;
  value: string;
}

interface ShareCardData {
  kicker: string;
  title: string;
  rows: ShareCardRow[];
  footer?: string;
  accent?: string;
}

const CARD_SIZE = 1080;
const PADDING = 72;
const BORDER = 14;
const CREAM = "#fdf5eb";
const INK = "#0a0a0a";

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] => {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    const last = lines[maxLines - 1] ?? "";
    lines[maxLines - 1] = `${last.slice(0, Math.max(0, last.length - 2))}…`;
  }
  return lines;
};

// Draws a 1080×1080 card: accent header band, headline, label/value rows, footer.
const renderShareCard = (data: ShareCardData): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_SIZE;
  canvas.height = CARD_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const accent = data.accent ?? "#ff8a3d";
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);

  // Header band with kicker + wrapped title.
  const bandHeight = 300;
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, CARD_SIZE, bandHeight);
  ctx.fillStyle = INK;
  ctx.font = "700 34px ui-monospace, monospace";
  ctx.textBaseline = "top";
  ctx.fillText(data.kicker.toUpperCase(), PADDING, PADDING - 8);
  ctx.font = "900 76px 'Segoe UI', system-ui, sans-serif";
  const titleLines = wrapText(ctx, data.title, CARD_SIZE - PADDING * 2, 2);
  titleLines.forEach((line, index) => {
    ctx.fillText(line, PADDING, PADDING + 66 + index * 88);
  });

  // Label/value rows.
  let y = bandHeight + 70;
  const rows = data.rows.slice(0, 7);
  const rowGap = rows.length > 5 ? 82 : 96;
  for (const row of rows) {
    ctx.fillStyle = "#5c544b";
    ctx.font = "700 32px ui-monospace, monospace";
    ctx.fillText(row.label.toUpperCase(), PADDING, y);
    ctx.fillStyle = INK;
    ctx.font = "900 46px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(row.value, CARD_SIZE - PADDING, y - 8);
    ctx.textAlign = "left";
    y += rowGap;
  }

  // Footer.
  ctx.fillStyle = INK;
  ctx.font = "700 30px ui-monospace, monospace";
  const footer = data.footer ?? "kokunime";
  ctx.fillText(footer, PADDING, CARD_SIZE - PADDING - 26);

  // Hard border (neobrutalist), drawn last so it sits on top.
  ctx.strokeStyle = INK;
  ctx.lineWidth = BORDER;
  ctx.strokeRect(BORDER / 2, BORDER / 2, CARD_SIZE - BORDER, CARD_SIZE - BORDER);

  return canvas;
};

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

// Shares the card as a PNG file when the platform supports it, otherwise
// downloads it. Returns how the card left the page.
export const exportShareCard = async (
  data: ShareCardData,
  filename: string,
  shareText?: string,
): Promise<"shared" | "downloaded" | "cancelled" | "failed"> => {
  const blob = await canvasToBlob(renderShareCard(data));
  if (!blob) return "failed";
  const file = new File([blob], filename, { type: "image/png" });

  if (shareText !== undefined && typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: data.title, text: shareText });
      return "shared";
    } catch {
      return "cancelled"; // Share sheet dismissed — keep the page as is.
    }
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
  return "downloaded";
};
