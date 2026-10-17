import type { Anime } from "@/interfaces";

// Tiny hand-maintained alias map for popular abbreviations/short titles.
// shortcut: extend the list as users report misses; fuzzy matching would need
// a local anime index, which this scraper-first app deliberately avoids.
const SEARCH_ALIASES: Record<string, string> = {
  aot: "shingeki no kyojin",
  snk: "shingeki no kyojin",
  "attack on titan": "shingeki no kyojin",
  jjk: "jujutsu kaisen",
  mha: "boku no hero academia",
  bnha: "boku no hero academia",
  hxh: "hunter x hunter",
  fmab: "fullmetal alchemist brotherhood",
  sao: "sword art online",
  csm: "chainsaw man",
  kny: "kimetsu no yaiba",
  "demon slayer": "kimetsu no yaiba",
  "re zero": "re:zero kara hajimeru",
  rezero: "re:zero kara hajimeru",
  tensura: "tensei shitara slime datta ken",
  "bunny girl senpai": "seishun buta yarou",
  oregairu: "yahari ore no seishun",
  "a silent voice": "koe no katachi",
  "your name": "kimi no na wa",
  "spy family": "spy x family",
};

export const normalizeSearchTerm = (raw: string): string =>
  raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

export const resolveSearchAlias = (query: string): string | null => SEARCH_ALIASES[normalizeSearchTerm(query)] ?? null;

// Alias results first (they answer the user's intent), then literal matches,
// deduped by canonical endpoint.
export const mergeSearchResults = (primary: Anime[], secondary: Anime[]): Anime[] => {
  const seen = new Set<string>();
  const merged: Anime[] = [];
  for (const item of [...primary, ...secondary]) {
    const key = (item.link?.endpoint || item.title || "").toLowerCase().replace(/\/+$/, "");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  return merged;
};
