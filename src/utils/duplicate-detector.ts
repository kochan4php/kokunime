interface DuplicateGroup<T> {
  key: string;
  items: T[];
}

// Words that never distinguish two entries of the same series on this site
// (upstream titles routinely append them). Kept deliberately small so
// genuinely different titles are not merged.
const NOISE_WORDS = new Set([
  "batch",
  "sub",
  "subs",
  "subtitle",
  "subtitles",
  "indo",
  "indonesia",
  "lengkap",
  "full",
  "dub",
  "dubbed",
  "hd",
  "sd",
  "tv",
  "ona",
  "ova",
  "special",
  "spesial",
]);

// Normalizes a title for duplicate detection: lowercase, strip accents and
// punctuation, drop noise words. "Jigoku Shoujo (Batch Sub Indo)" and
// "jigoku shoujo" collapse to the same key.
export const normalizeTitle = (title: string): string =>
  title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(" ")
    .filter((word) => word && !NOISE_WORDS.has(word))
    .join(" ")
    .trim();

// Groups items whose normalized titles collide. Groups of one are dropped.
export const findDuplicateGroups = <T extends { title: string }>(items: T[]): DuplicateGroup<T>[] => {
  const byKey = new Map<string, T[]>();
  for (const item of items) {
    const key = normalizeTitle(item.title);
    if (!key) continue;
    const bucket = byKey.get(key);
    if (bucket) bucket.push(item);
    else byKey.set(key, [item]);
  }
  return [...byKey.entries()].filter(([, group]) => group.length > 1).map(([key, group]) => ({ key, items: group }));
};
