import { describe, expect, it } from "vitest";
import { countRequests, extractAssets } from "../scripts/lib/bundle-budget.mjs";

const html = `<!doctype html>
<a href="/anime/one-piece">One Piece</a>
<link rel="preload" href="/fonts/pjs-latin.woff2" as="font" crossorigin="anonymous">
<link rel="preload" href="/fonts/pjs-latin.woff2" as="font" type="font/woff2">
<link rel="stylesheet" href="/_next/static/chunks/site.css?rev=1&amp;theme=dark">
<link rel="preload" as="script" href="/_next/static/chunks/preload.js">
<script src="/_next/static/chunks/app.js"></script>
<script src="/_next/static/chunks/app.js"></script>
<img src="/images/cover.webp" alt="">
<img srcset="https://cdn.example/small.webp 1x, https://cdn.example/large.webp 2x" src="/images/fallback.webp" alt="">
<img src="data:image/png;base64,AAAA" alt="">
<picture>
  <source srcset="https://cdn.example/hero.avif" type="image/avif">
  <img src="/images/hero.jpg" alt="">
</picture>
<video><source src="/media/clip.mp4" type="video/mp4"></video>
<link rel="preload" as="image" href="/images/banner.webp">
<link rel="preload" as="image" imagesrcset="https://cdn.example/banner-small.webp 1x, https://cdn.example/banner-large.webp 2x">
`;

describe("bundle budget asset extraction", () => {
  it("collects each network asset once and ignores page links", () => {
    const assets = extractAssets(html);

    expect(assets.js.sort()).toEqual(["/_next/static/chunks/app.js", "/_next/static/chunks/preload.js"]);
    expect(assets.css).toEqual(["/_next/static/chunks/site.css?rev=1&theme=dark"]);
    expect(assets.fonts).toEqual(["/fonts/pjs-latin.woff2"]);
    expect(assets.images.sort()).toEqual(
      [
        "/images/banner.webp",
        "/images/cover.webp",
        "/images/fallback.webp",
        "/images/hero.jpg",
        "https://cdn.example/banner-small.webp",
      ].sort(),
    );
    expect(assets.images).not.toContain("/anime/one-piece");
    expect(assets.images).not.toContain("/media/clip.mp4");
  });

  it("counts unique requests across asset types", () => {
    expect(countRequests(extractAssets(html))).toBe(9);
  });
});
