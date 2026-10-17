import { JSX } from "react";

const DetailHeroSkeleton = (): JSX.Element => (
  <div className="card-shell">
    <div className="card-core grid md:grid-cols-[320px_1fr]">
      <div className="skeleton aspect-[3/4] md:aspect-auto md:min-h-full" />
      <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
        <div className="skeleton h-5 w-2/3 rounded-sm" />
        <div className="skeleton h-9 w-3/4 rounded-sm md:h-11" />
        <div className="skeleton h-4 w-1/2 rounded-sm" />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton h-16 rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DetailHeroSkeleton;
