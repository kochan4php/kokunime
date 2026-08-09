import sharp from "sharp";

const width = 1200;
const height = 630;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#201613"/>
  <circle cx="1050" cy="40" r="300" fill="#ff7c47" opacity="0.22"/>
  <circle cx="80" cy="600" r="260" fill="#8b5cf6" opacity="0.18"/>
  <circle cx="600" cy="315" r="420" fill="#ff6a33" opacity="0.05"/>
  <text x="600" y="330" font-family="Arial, sans-serif" font-size="96" font-weight="800" fill="#f4e7df" text-anchor="middle">Kokunime</text>
  <text x="600" y="410" font-family="Arial, sans-serif" font-size="34" fill="#c7a693" text-anchor="middle">Download Anime Subtitle Indonesia</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("Generated public/og.png");
