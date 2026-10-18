import { AnimeDetail } from "@/interfaces";
import { extractYear } from "@/utils/similar";

// Shared helpers for the side-by-side dashboard (2–3 titles). Kept free of
// React so the set math and winner picking stay unit-testable.

const SERIES_MARKS = ["🔴", "🔵", "🟣"] as const;
const SERIES_COLORS = ["#ff6b6b", "#23a094", "#a855f7"] as const;

/** Side mark (🔴/🔵/🟣) for a slot index; purple is the fallback. */
export const seriesMark = (index: number): string => SERIES_MARKS[index] ?? "🟣";

/** Radar stroke/fill color for a slot index. */
export const seriesColor = (index: number): string => SERIES_COLORS[index] ?? "#a855f7";

/** Indices holding the highest value; several on a tie, empty when all are 0. */
export const pickWinners = (values: number[]): number[] => {
  const max = Math.max(...values, 0);
  if (max <= 0) return [];
  return values.flatMap((value, index) => (value === max ? [index] : []));
};

/** Genres shared by every list, plus the genres each list has on its own. */
export const buildGenreSets = (genreLists: string[][]): { shared: string[]; uniques: string[][] } => {
  const shared = (genreLists[0] ?? []).filter((genre) => genreLists.every((list) => list.includes(genre)));
  const uniques = genreLists.map((list, index) =>
    list.filter((genre) => !genreLists.some((other, otherIndex) => otherIndex !== index && other.includes(genre))),
  );
  return { shared, uniques };
};

interface CompareMetric {
  key: string;
  label: string;
  /** One raw value per compared title, index-aligned with the slots. */
  values: number[];
  display: (value: number) => string;
  /** true when a lower value is better (none today, kept for clarity). */
  lowerIsBetter?: boolean;
}

const parseFirstNumber = (value?: string | null): number => {
  const match = value?.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

// Five locally computable metrics — no extra requests. Values are the raw
// numbers; the radar normalizes per axis by the highest of the compared titles.
export const buildCompareMetrics = (...animes: AnimeDetail[]): CompareMetric[] => [
  {
    key: "score",
    label: "Skor",
    values: animes.map((anime) => Number(anime.score ?? 0)),
    display: (value) => (value > 0 ? value.toFixed(1) : "—"),
  },
  {
    key: "episodes",
    label: "Episode",
    values: animes.map((anime) => parseFirstNumber(anime.total_episode)),
    display: (value) => (value > 0 ? String(value) : "—"),
  },
  {
    key: "duration",
    label: "Durasi",
    values: animes.map((anime) => parseFirstNumber(anime.duration)),
    display: (value) => (value > 0 ? `${value} m` : "—"),
  },
  {
    key: "genres",
    label: "Genre",
    values: animes.map((anime) => anime.genre?.length ?? 0),
    display: (value) => (value > 0 ? String(value) : "—"),
  },
  {
    key: "year",
    label: "Tahun",
    values: animes.map((anime) => extractYear(anime.release_on) ?? 0),
    display: (value) => (value > 0 ? String(value) : "—"),
  },
];
