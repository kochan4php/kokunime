import CardSkeleton from "@/components/cards/card-skeleton";
import { JSX } from "react";

interface GridSkeletonProps {
  count?: number;
}

const GridSkeleton = ({ count = 10 }: GridSkeletonProps): JSX.Element => (
  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
    {Array.from({ length: count }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);

export default GridSkeleton;
