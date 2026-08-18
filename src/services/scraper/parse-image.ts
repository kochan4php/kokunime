import { UPSTREAM_URL } from "./constants";

export function resolveAssetUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith("/")) {
    const base = UPSTREAM_URL.replace(/\/+$/, "");
    return `${base}${trimmed}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return undefined;
}

// upstream thumbnails ship a 150px `src` plus a `srcset` or `data-srcset` of larger variants.
// Picking the largest gives next/image a sharp source for cards/hero.
type ImgLike = { attr(name: string): string | undefined };

export function bestImage($img: ImgLike): string | undefined {
  const srcset = $img.attr("srcset") || $img.attr("data-srcset");
  if (srcset) {
    const best = srcset
      .split(",")
      .map((candidate) => {
        const [url, size] = candidate.trim().split(/\s+/);
        const resolved = resolveAssetUrl(url);
        return { url: resolved, width: parseInt(size ?? "", 10) || 0 };
      })
      .filter((c) => Boolean(c.url))
      .sort((a, b) => b.width - a.width)[0];
    if (best?.url) return best.url;
  }

  const candidate =
    $img.attr("data-lazy-src") ||
    $img.attr("data-src") ||
    $img.attr("data-original") ||
    $img.attr("src");

  return resolveAssetUrl(candidate);
}
