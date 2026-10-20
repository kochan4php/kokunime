// Pure HTML asset extraction for scripts/bundle-budget.mjs. Kept separate so
// the parsing can be tested without a production build.

const decodeHtml = (value) => value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'");

const attr = (tag, name) => {
  const quoted = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  if (quoted) return quoted[2] ?? quoted[3] ?? "";
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*([^\\s>]+)`, "i"))?.[1];
};

const firstSrcset = (value) => {
  if (!value) return undefined;
  const first = value.split(",")[0]?.trim().split(/\s+/)[0];
  return first && !first.startsWith("data:") ? first : undefined;
};

// Network assets referenced by the prerendered HTML, deduplicated. Remote
// images count as requests but have no local size; CSS background images are
// out of scope because one stylesheet serves many routes.
export const extractAssets = (html) => {
  const js = new Set();
  const css = new Set();
  const fonts = new Set();
  const images = new Set();

  for (const tag of html.match(/<script\b[^>]*>/gi) ?? []) {
    const src = attr(tag, "src");
    if (src) js.add(decodeHtml(src));
  }

  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/);
    const as = (attr(tag, "as") ?? "").toLowerCase();

    if (rel.includes("preload") && as === "image") {
      const src = attr(tag, "href") ?? firstSrcset(attr(tag, "imagesrcset"));
      if (src && !src.startsWith("data:")) images.add(decodeHtml(src));
      continue;
    }

    const href = attr(tag, "href");
    if (!href) continue;
    if (rel.includes("stylesheet")) css.add(decodeHtml(href));
    else if (rel.includes("preload") && as === "script") js.add(decodeHtml(href));
    else if (rel.includes("preload") && as === "font") fonts.add(decodeHtml(href));
  }

  // A <picture> loads one image even though it lists several candidates.
  const pictures = html.match(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi) ?? [];
  for (const block of pictures) {
    const imgTag = block.match(/<img\b[^>]*>/i)?.[0] ?? "";
    const sourceTag = block.match(/<source\b[^>]*>/i)?.[0] ?? "";
    const src =
      attr(imgTag, "src") ??
      firstSrcset(attr(imgTag, "srcset")) ??
      firstSrcset(attr(sourceTag, "srcset")) ??
      attr(sourceTag, "src");
    if (src && !src.startsWith("data:")) images.add(decodeHtml(src));
  }

  const withoutPictures = html.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi, "");
  for (const tag of withoutPictures.match(/<img\b[^>]*>/gi) ?? []) {
    const src = attr(tag, "src") ?? firstSrcset(attr(tag, "srcset"));
    if (src && !src.startsWith("data:")) images.add(decodeHtml(src));
  }

  for (const tag of withoutPictures.match(/<source\b[^>]*>/gi) ?? []) {
    const type = (attr(tag, "type") ?? "").toLowerCase();
    if (type && !type.startsWith("image/")) continue;
    const src = firstSrcset(attr(tag, "srcset")) ?? attr(tag, "src");
    if (src && !src.startsWith("data:")) images.add(decodeHtml(src));
  }

  return { js: [...js], css: [...css], fonts: [...fonts], images: [...images] };
};

export const countRequests = (assets) => new Set([...assets.js, ...assets.css, ...assets.fonts, ...assets.images]).size;
