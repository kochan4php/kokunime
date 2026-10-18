import RecommendedSkeleton from "@/components/cards/recommended-skeleton";
import { JSX } from "react";

// Fallback for streamed below-fold rails: matched width so the rail does not
// jump the layout when its data arrives.
const RailSkeleton = (): JSX.Element => (
  <div className="container px-4 pt-10">
    <RecommendedSkeleton />
  </div>
);

export default RailSkeleton;
