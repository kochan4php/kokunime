// Operator syntax for catalog search. Pure + unit-tested.
//
//   genre:action,adventure   ANY-of genre filter
//   tahun:2024,2025          release-year filter
//   skor:8                   minimum score/rating (local catalog only)
//   studio:mappa             studio filter (local catalog only)
//   -movie                   exclude term
//   everything else          free text
//
// The skor:/studio: dimensions only have data where the catalog knows it
// (titles the visitor actually opened), so server-side ranking ignores them
// instead of silently dropping every result.
export interface ParsedQuery {
  text: string;
  genres: string[];
  exclude: string[];
  years: string[];
  minRating: number | null;
  studios: string[];
}

const splitList = (value: string): string[] =>
  value
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

export const parseQuerySyntax = (raw: string): ParsedQuery => {
  const genres: string[] = [];
  const exclude: string[] = [];
  const years: string[] = [];
  const studios: string[] = [];
  const text: string[] = [];
  let minRating: number | null = null;

  for (const token of raw.split(/\s+/).filter(Boolean)) {
    const genreMatch = token.match(/^genre:(.+)$/i);
    const genreValue = genreMatch?.[1];
    if (genreValue) {
      genres.push(...splitList(genreValue));
      continue;
    }

    const yearMatch = token.match(/^tahun:(.+)$/i);
    const yearValue = yearMatch?.[1];
    if (yearValue) {
      const parsedYears = yearValue
        .split(",")
        .map((part) => part.trim())
        .filter((part) => /^\d{4}$/.test(part));
      years.push(...parsedYears);
      continue;
    }

    const scoreMatch = token.match(/^skor:(.+)$/i);
    const scoreValue = scoreMatch?.[1];
    if (scoreValue) {
      const score = Number(scoreValue.replace(",", "."));
      if (Number.isFinite(score)) minRating = Math.min(10, Math.max(0, score));
      continue;
    }

    const studioMatch = token.match(/^studio:(.+)$/i);
    const studioValue = studioMatch?.[1];
    if (studioValue) {
      studios.push(...splitList(studioValue));
      continue;
    }

    if (token.startsWith("-") && token.length > 1) {
      exclude.push(token.slice(1));
      continue;
    }
    text.push(token);
  }

  return { text: text.join(" "), genres, exclude, years, minRating, studios };
};

// Whether a raw query uses operators that only the local catalog can honour.
export const queryUsesLocalOnlyFilters = (raw: string): boolean => {
  const parsed = parseQuerySyntax(raw);
  return parsed.minRating !== null || parsed.studios.length > 0;
};
