import GridSkeleton from "@/components/grid-skeleton";
import { JSX } from "react";

const ListingSkeleton = (): JSX.Element => (
  <section className="container px-4 py-12 md:py-20" aria-label="Memuat">
    <div className="skeleton h-3 w-24 rounded-full" />
    <div className="skeleton mt-3 h-8 w-56 rounded-lg" />
    <div className="mt-10">
      <GridSkeleton count={10} />
    </div>
  </section>
);

export default ListingSkeleton;
