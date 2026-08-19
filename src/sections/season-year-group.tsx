import { endpointSlug } from "@/utils/endpoint-slug";
import TaxonomyCard from "@/sections/taxonomy-card";
import Reveal from "@/components/reveal";
import { Season } from "@/interfaces";
import { JSX } from "react";

interface SeasonYearGroupProps {
  year: string;
  seasons: Season[];
}

const SeasonYearGroup = ({ year, seasons }: SeasonYearGroupProps): JSX.Element => (
  <div>
    <Reveal>
      <h2 className="mb-4 font-display text-xl font-bold tracking-tight text-ink">{year}</h2>
    </Reveal>
    <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {seasons.map((season) => {
        const slug = endpointSlug(season.endpoint, "seasons");
        if (!slug) return null;

        return <TaxonomyCard key={slug} href={`/seasons/${slug}`} title={season.name} meta="Musim" />;
      })}
    </div>
  </div>
);

export default SeasonYearGroup;
