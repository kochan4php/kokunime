import sharp from "sharp";
import { mkdirSync } from "node:fs";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff7c47"/>
      <stop offset="55%" stop-color="#ff8a5c"/>
      <stop offset="100%" stop-color="#f0b45f"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="#201613"/>
  <circle cx="416" cy="96" r="130" fill="#ff7c47" opacity="0.28"/>
  <circle cx="80" cy="440" r="120" fill="#8b5cf6" opacity="0.2"/>
  <path fill="url(#grad)" d="M150 110h64v292h-64z M214 235l196-120v64l-196 120z M214 295l196 100v-64l-196-64z"/>
</svg>`;

mkdirSync("public/icons", { recursive: true });

await sharp(Buffer.from(svg)).resize(192, 192).png().toFile("public/icons/icon-192.png");
await sharp(Buffer.from(svg)).resize(512, 512).png().toFile("public/icons/icon-512.png");
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile("public/apple-touch-icon.png");
console.log("Generated PWA + apple-touch icons");
