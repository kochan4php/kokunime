import sharp from "sharp";
import { mkdirSync } from "node:fs";

// Branded "screenshot" cards for the PWA manifest. There is no headless
// browser in this toolchain, so these are composed (not captured) — keep them
// a fair representation of the hero + catalog layout.
const INK = "#201613";
const BG = "#fdf5eb";
const GRID = "#00000012";

const grid = (w, h) => `
  <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
    <path d="M48 0H0V48" fill="none" stroke="${GRID}" stroke-width="2"/>
  </pattern>
  <rect width="${w}" height="${h}" fill="${BG}"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>`;

const navbar = (w) => `
  <rect x="0" y="0" width="${w}" height="112" fill="${INK}"/>
  <rect x="40" y="36" width="40" height="40" rx="8" fill="#ff7c47"/>
  <text x="96" y="70" font-family="sans-serif" font-size="34" font-weight="700" fill="${BG}">Kokunime</text>
  <text x="${w - 40}" y="68" font-family="sans-serif" font-size="24" text-anchor="end" fill="#ff7c47">Cari anime…</text>`;

const card = (x, y, w, h, color) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#ffffff" stroke="${INK}" stroke-width="4"/>
    <rect x="${x}" y="${y}" width="${w}" height="${Math.round(h * 0.68)}" rx="10" fill="${color}"/>
    <rect x="${x + 14}" y="${y + h - 44}" width="${w - 28}" height="14" rx="4" fill="${INK}" opacity="0.85"/>
    <rect x="${x + 14}" y="${y + h - 24}" width="${Math.round((w - 28) * 0.6)}" height="12" rx="4" fill="${INK}" opacity="0.45"/>
  </g>`;

const badge = (x, y, text, color) => `
  <g>
    <rect x="${x}" y="${y}" width="${text.length * 20 + 40}" height="52" rx="8" fill="${color}" stroke="${INK}" stroke-width="4"/>
    <text x="${x + 20}" y="${y + 36}" font-family="monospace" font-size="28" font-weight="700" fill="${INK}">${text}</text>
  </g>`;

const narrow = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  ${grid(1080, 1920)}
  ${navbar(1080)}
  ${badge(64, 208, "UPDATE UNGGULAN", "#ffd53d")}
  <text x="64" y="368" font-family="sans-serif" font-size="72" font-weight="800" fill="${INK}">Download Anime</text>
  <text x="64" y="456" font-family="sans-serif" font-size="72" font-weight="800" fill="${INK}">Subtitle Indonesia</text>
  <rect x="64" y="520" width="952" height="560" rx="14" fill="#2ec4b6" stroke="${INK}" stroke-width="6"/>
  <text x="104" y="600" font-family="sans-serif" font-size="40" font-weight="800" fill="${INK}">Batch &amp; episode lengkap</text>
  <text x="104" y="664" font-family="monospace" font-size="30" fill="${INK}" opacity="0.75">update setiap hari · 1080p · ringan</text>
  ${card(64, 1160, 296, 420, "#ff9ecd")}
  ${card(392, 1160, 296, 420, "#b8a7f5")}
  ${card(720, 1160, 296, 420, "#c6f06b")}
  ${card(64, 1620, 296, 420, "#8fd3ff")}
  ${card(392, 1620, 296, 420, "#ffd53d")}
  ${card(720, 1620, 296, 420, "#ffab76")}
</svg>`;

const wide = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  ${grid(1920, 1080)}
  ${navbar(1920)}
  ${badge(64, 176, "ANIME TERBARU", "#ffd53d")}
  <text x="64" y="336" font-family="sans-serif" font-size="76" font-weight="800" fill="${INK}">Pilih anime,</text>
  <text x="64" y="428" font-family="sans-serif" font-size="76" font-weight="800" fill="${INK}">unduh batch-nya.</text>
  <text x="64" y="512" font-family="monospace" font-size="30" fill="${INK}" opacity="0.75">subtitle Indonesia · resolusi lengkap · gratis</text>
  <rect x="1000" y="200" width="856" height="480" rx="16" fill="#ff7c47" stroke="${INK}" stroke-width="6"/>
  <text x="1050" y="300" font-family="sans-serif" font-size="44" font-weight="800" fill="${INK}">Halaman detail</text>
  <text x="1050" y="364" font-family="monospace" font-size="28" fill="${INK}" opacity="0.8">link download per resolusi + sinopsis</text>
  ${card(64, 640, 400, 370, "#2ec4b6")}
  ${card(504, 640, 400, 370, "#ff9ecd")}
  ${card(944, 640, 400, 370, "#b8a7f5")}
  ${card(1384, 640, 400, 370, "#ffd53d")}
</svg>`;

mkdirSync("public/screenshots", { recursive: true });

await sharp(Buffer.from(narrow)).png().toFile("public/screenshots/home-narrow.png");
await sharp(Buffer.from(wide)).png().toFile("public/screenshots/detail-wide.png");
console.log("Generated PWA manifest screenshots");
