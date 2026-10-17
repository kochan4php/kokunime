// Season window math for the season pages. Pure + timezone-local so the same
// function runs in server components and tests with an injected "now".
const SEASON_RANGES: Record<string, { startMonth: number; endMonth: number }> = {
  winter: { startMonth: 0, endMonth: 2 },
  spring: { startMonth: 3, endMonth: 5 },
  summer: { startMonth: 6, endMonth: 8 },
  fall: { startMonth: 9, endMonth: 11 },
};

interface SeasonWindow {
  season: string;
  year: number;
  startsAt: number;
  endsAt: number;
  state: "upcoming" | "airing" | "ended";
  daysUntilStart: number;
  daysUntilEnd: number;
}

export const parseSeasonSlug = (slug: string): { season: string; year: number } | null => {
  const match = /^([a-z]+)-(\d{4})$/i.exec(slug.trim());
  if (!match) return null;
  const season = (match[1] ?? "").toLowerCase();
  const year = Number(match[2]);
  if (!SEASON_RANGES[season] || !Number.isFinite(year)) return null;
  return { season, year };
};

export const getSeasonWindow = (slug: string, now: Date = new Date()): SeasonWindow | null => {
  const parsed = parseSeasonSlug(slug);
  if (!parsed) return null;
  const range = SEASON_RANGES[parsed.season];
  if (!range) return null;

  const startsAt = new Date(parsed.year, range.startMonth, 1).getTime();
  const endsAt = new Date(parsed.year, range.endMonth + 1, 1).getTime();
  const nowMs = now.getTime();
  const day = 24 * 60 * 60 * 1000;

  return {
    season: parsed.season,
    year: parsed.year,
    startsAt,
    endsAt,
    state: nowMs < startsAt ? "upcoming" : nowMs >= endsAt ? "ended" : "airing",
    daysUntilStart: Math.ceil((startsAt - nowMs) / day),
    daysUntilEnd: Math.ceil((endsAt - nowMs) / day),
  };
};
