import NewSeriesAnime from "@/sections/new-series-anime";
import NewSeriesSkeleton from "./new-series-skeleton";
import Reveal from "@/components/reveal";
import { JSX, Suspense } from "react";

const NewSeriesSection = ({ slug }: any): JSX.Element => (
  <div className="mt-20">
    <Reveal>
      <div className="mb-6 flex items-center gap-4">
        <span className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
          Lainnya
        </span>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">New Add Series</h2>
      </div>
    </Reveal>
    <Reveal>
      <Suspense fallback={<NewSeriesSkeleton />}>
        <NewSeriesAnime slug={slug} />
      </Suspense>
    </Reveal>
  </div>
);

export default NewSeriesSection;
