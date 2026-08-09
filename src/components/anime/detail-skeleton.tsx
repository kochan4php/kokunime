import DetailDownloadSkeleton from "./detail-download-skeleton";
import DetailHeroSkeleton from "./detail-hero-skeleton";
import { JSX } from "react";

const DetailSkeleton = (): JSX.Element => (
  <>
    <DetailHeroSkeleton />
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="card-shell">
        <div className="card-core p-7 md:p-10">
          <div className="skeleton h-3 w-20 rounded-full" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton h-4 w-full rounded" />
            ))}
          </div>
        </div>
      </div>
      <div className="card-shell">
        <div className="card-core p-7 md:p-8">
          <div className="skeleton h-3 w-16 rounded-full" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton h-4 w-3/4 rounded" />
            ))}
          </div>
          <div className="skeleton mt-6 h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
    <DetailDownloadSkeleton />
  </>
);

export default DetailSkeleton;
