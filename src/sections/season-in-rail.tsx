import SeasonRail from "@/sections/season-rail";
import { getSeasons } from "@/services/scraper";
import { endpointSlug } from "@/utils/endpoint-slug";
import { pickCurrentSeason } from "@/utils/season-window";
import { JSX } from "react";

// Home rail for the season airing right now. Hidden when the upstream
// taxonomy is cold or the season listing has nothing to show.
const SeasonInRail = async (): Promise<JSX.Element | null> => {
  const seasons = await getSeasons().catch(() => []);
  const current = pickCurrentSeason(seasons);
  const seasonSlug = endpointSlug(current?.endpoint, "seasons");
  if (!seasonSlug) return null;

  return (
    <SeasonRail
      seasonSlug={seasonSlug}
      seasonName={current?.name}
      excludeSlug=""
      heading="🍂 Musim Ini"
      kicker="lagi tayang"
    />
  );
};

export default SeasonInRail;
