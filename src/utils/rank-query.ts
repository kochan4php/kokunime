import { fuzzyScore } from "@/utils/fuzzy";
import { ParsedQuery } from "@/utils/query-syntax";

// Shared title ranking for both the server index (Redis) and the client
// catalog, so a local result and an upstream result rank the same way. Pure.
export interface RankableTitle {
  slug: string;
  title: string;
  genres?: string[] | undefined;
  release?: string | undefined;
  rating?: string | undefined;
  studio?: string | undefined;
}

const compact = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, "");

// Dimensions that only exist in the richer client catalog (score/studio come
// from detail pages). Kept separate so the pure ranker never drops records
// just because a dimension is unknown there.
export const matchesLocalFilters = (item: RankableTitle, parsed: ParsedQuery): boolean => {
  if (parsed.minRating !== null) {
    const rating = Number.parseFloat((item.rating ?? "").replace(",", "."));
    if (!Number.isFinite(rating) || rating < parsed.minRating) return false;
  }

  if (parsed.studios.length > 0) {
    const studio = (item.studio ?? "").toLowerCase();
    if (!studio || !parsed.studios.some((value) => studio.includes(value))) return false;
  }

  return true;
};

// Pure ranking helper (unit-tested): compact substring/subsequence match with a
// token-AND fallback, genre ANY-of filter, year filter and exclusion terms.
export const rankTitles = <T extends RankableTitle>(records: T[], parsed: ParsedQuery, limit = 20): T[] => {
  const nq = compact(parsed.text);
  const tokens = parsed.text.split(/\s+/).map(compact).filter(Boolean);
  const scored: { item: T; score: number }[] = [];

  for (const item of records) {
    if (parsed.genres.length > 0) {
      const itemGenres = (item.genres ?? []).map((genre) => genre.toLowerCase());
      const matchesGenre = parsed.genres.some((genre) => itemGenres.some((itemGenre) => itemGenre.includes(genre)));
      if (!matchesGenre) continue;
    }

    if (parsed.years.length > 0) {
      const release = item.release ?? "";
      if (!parsed.years.some((year) => release.includes(year))) continue;
    }

    const nt = compact(item.title);
    if (parsed.exclude.length > 0 && parsed.exclude.some((term) => compact(term) && nt.includes(compact(term))))
      continue;

    if (!nq && tokens.length === 0) {
      scored.push({ item, score: 1 });
      continue;
    }

    let score = nq ? fuzzyScore(nq, nt) : 0;
    if (score === 0 && tokens.length > 0) {
      let total = 0;
      let allMatched = true;
      for (const token of tokens) {
        const tokenScore = fuzzyScore(token, nt);
        if (tokenScore === 0) {
          allMatched = false;
          break;
        }
        total += tokenScore;
      }
      if (allMatched) score = Math.max(20, total / tokens.length);
    }
    if (score > 0) scored.push({ item, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
};
