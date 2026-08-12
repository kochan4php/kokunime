// kusonime thumbnails ship a 150px `src` plus a `srcset` of larger variants.
// Picking the largest gives next/image a sharp source for cards/hero.
type ImgLike = { attr(name: string): string | undefined };

export function bestImage($img: ImgLike): string | undefined {
  const srcset = $img.attr("srcset");
  if (srcset) {
    const best = srcset
      .split(",")
      .map((candidate) => {
        const [url, size] = candidate.trim().split(/\s+/);
        return { url, width: parseInt(size ?? "", 10) || 0 };
      })
      .sort((a, b) => b.width - a.width)[0];
    if (best?.url) return best.url;
  }
  return $img.attr("src") ?? undefined;
}
