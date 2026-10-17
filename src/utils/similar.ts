interface SimilarInput {
  genres?: string[] | undefined;
  score?: number | string | undefined;
  year?: number | string | undefined;
  type?: string | undefined;
}

const genreSet = (genres?: string[]): Set<string> =>
  new Set((genres ?? []).map((genre) => genre.trim().toLowerCase()).filter(Boolean));

const numeric = (value?: number | string): number | null => {
  const parsed = typeof value === "number" ? value : parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : null;
};

// 0-100 client-side similarity score — genre overlap dominates, then year,
// score and type proximity. Powers /compare without any network round-trip.
export const similarityScore = (a: SimilarInput, b: SimilarInput): number => {
  const genresA = genreSet(a.genres);
  const genresB = genreSet(b.genres);
  let genreScore = 0;
  if (genresA.size > 0 && genresB.size > 0) {
    let shared = 0;
    for (const genre of genresA) {
      if (genresB.has(genre)) shared++;
    }
    const union = genresA.size + genresB.size - shared;
    genreScore = union > 0 ? shared / union : 0;
  }

  const yearA = numeric(a.year);
  const yearB = numeric(b.year);
  const yearScore = yearA !== null && yearB !== null ? 1 / (1 + Math.abs(yearA - yearB) / 3) : 0.5;

  const scoreA = numeric(a.score);
  const scoreB = numeric(b.score);
  const scoreScore = scoreA !== null && scoreB !== null ? 1 - Math.min(1, Math.abs(scoreA - scoreB) / 10) : 0.5;

  const typeScore = a.type && b.type ? (a.type.trim().toLowerCase() === b.type.trim().toLowerCase() ? 1 : 0) : 0.5;

  return Math.round((genreScore * 0.6 + yearScore * 0.15 + scoreScore * 0.15 + typeScore * 0.1) * 100);
};

// "Fall 2024" / "2024" / 2024 → 2024.
export const extractYear = (raw?: string | number | null): number | undefined => {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : undefined;
  const match = String(raw ?? "").match(/(19|20)\d{2}/);
  return match ? Number(match[0]) : undefined;
};
