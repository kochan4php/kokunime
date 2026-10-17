import { unstable_cache } from "next/cache";
import sharp from "sharp";

// Blur placeholders for the two LCP images (home hero + detail cover) only:
// one tiny upstream image fetch per anime, cached 30 days in the data cache
// (and process-locally), so later builds/pods reuse it. Failures are silent —
// the image just renders with the existing skeleton background.
const MAX_ENTRIES = 300;
const FETCH_TIMEOUT_MS = 4_000;

const memory = new Map<string, string>();

const compute = async (src: string): Promise<string | undefined> => {
  const cached = memory.get(src);
  if (cached) return cached;

  try {
    const res = await fetch(src, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { accept: "image/*", "user-agent": "Kokunime/1.0 (+blur-placeholder)" },
    });
    if (!res.ok) return undefined;
    const input = Buffer.from(await res.arrayBuffer());
    const output = await sharp(input).resize(12).webp({ quality: 40 }).toBuffer();
    const dataUrl = `data:image/webp;base64,${output.toString("base64")}`;
    if (memory.size >= MAX_ENTRIES) memory.clear();
    memory.set(src, dataUrl);
    return dataUrl;
  } catch {
    return undefined;
  }
};

export const getBlurDataUrl = async (src?: string | null): Promise<string | undefined> => {
  if (!src || !src.startsWith("https://")) return undefined;
  if (process.env.NODE_ENV === "test") return compute(src);
  return unstable_cache(() => compute(src), ["cover-blur", src], { revalidate: 60 * 60 * 24 * 30 })();
};
