import { JSX } from "react";

const CardSkeleton = (): JSX.Element => (
  <div className="card-shell">
    <div className="card-core">
      <div className="skeleton aspect-[3/4]" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
      </div>
    </div>
  </div>
);

export default CardSkeleton;
