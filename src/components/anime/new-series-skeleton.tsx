import { JSX } from "react";

const NewSeriesSkeleton = (): JSX.Element => (
  <div className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {Array.from({ length: 14 }).map((_, index) => (
      <div key={index} className="card-shell w-32 shrink-0 snap-start sm:w-36">
        <div className="card-core">
          <div className="skeleton aspect-[3/4]" />
          <div className="space-y-2 p-2.5">
            <div className="skeleton h-3 w-3/4 rounded" />
            <div className="skeleton h-2.5 w-1/2 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default NewSeriesSkeleton;
