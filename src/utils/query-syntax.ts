// Local inverted-ish index of the anime catalog, grown opportunistically from
// every listing the scraper touches and stored in Redis. Search/suggest read a
// 5-minute in-process snapshot; without REDIS_URL everything no-ops back to
// upstream-only behavior.

export interface ParsedQuery {
  text: string;
  genres: string[];
  exclude: string[];
}

// Operator syntax: genre:a,b (ANY-of), -term (exclude), everything else is the
// free-text query. Pure + unit-tested.
export const parseQuerySyntax = (raw: string): ParsedQuery => {
  const genres: string[] = [];
  const exclude: string[] = [];
  const text: string[] = [];

  for (const token of raw.split(/\s+/).filter(Boolean)) {
    const genreMatch = token.match(/^genre:(.+)$/i);
    const genreValue = genreMatch?.[1];
    if (genreValue) {
      genres.push(
        ...genreValue
          .split(",")
          .map((value) => value.trim().toLowerCase())
          .filter(Boolean),
      );
      continue;
    }
    if (token.startsWith("-") && token.length > 1) {
      exclude.push(token.slice(1));
      continue;
    }
    text.push(token);
  }

  return { text: text.join(" "), genres, exclude };
};
