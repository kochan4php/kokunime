import { JSX } from "react";

const DetailDownloadSkeleton = (): JSX.Element => (
  <div className="mt-16 space-y-4">
    <div className="skeleton h-3 w-28 rounded-full" />
    {Array.from({ length: 2 }).map((_, index) => (
      <div key={index} className="card-shell">
        <div className="card-core space-y-4 p-6 md:p-8">
          <div className="skeleton h-6 w-1/3 rounded-lg" />
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((__, i) => (
              <div key={i} className="skeleton h-10 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default DetailDownloadSkeleton;
