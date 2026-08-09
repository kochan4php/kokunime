import { Season } from "@/interfaces";

export const groupSeasonsByYear = (seasons: Season[]): Record<string, Season[]> =>
  seasons.reduce<Record<string, Season[]>>((groups, season) => {
    const year = season.name?.match(/\b(19|20)\d{2}\b/)?.[0] ?? "Lainnya";
    (groups[year] ??= []).push(season);
    return groups;
  }, {});

export const orderYears = (groups: Record<string, Season[]>): string[] =>
  Object.keys(groups).sort((a, b) => (a === "Lainnya" ? 1 : b === "Lainnya" ? -1 : Number(b) - Number(a)));
