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

// Picks the season to feature on the home rail: the one airing right now, or —
// when the upstream taxonomy has no current entry yet — the most recently
// started season before now. Names come as "Spring 2026"; anything else is
// skipped rather than guessed.
export const pickCurrentSeason = <T extends { name: string }>(seasons: T[], now: Date = new Date()): T | null => {
  let best: { item: T; startsAt: number } | null = null;
  for (const item of seasons) {
    const match = /^(winter|spring|summer|fall)\s+(\d{4})/i.exec((item.name ?? "").trim());
    if (!match) continue;
    const window = getSeasonWindow(`${match[1]}-${match[2]}`, now);
    if (!window) continue;
    if (window.state === "airing") return item;
    if (window.startsAt <= now.getTime() && (!best || window.startsAt > best.startsAt)) {
      best = { item, startsAt: window.startsAt };
    }
  }
  return best?.item ?? null;
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
