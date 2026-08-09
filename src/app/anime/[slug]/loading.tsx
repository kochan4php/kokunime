import MainLayout from "@/layouts/MainLayout";
import { JSX } from "react";

const AnimeLoading = (): JSX.Element => (
  <MainLayout>
    <section className="container px-4 py-8 md:py-12" aria-label="Memuat detail anime">
      <div className="card-shell">
        <div className="card-core grid md:grid-cols-[320px_1fr]">
          <div className="skeleton aspect-[3/4] md:aspect-auto md:min-h-full" />
          <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
            <div className="skeleton h-5 w-2/3 rounded-full" />
            <div className="skeleton h-9 w-3/4 rounded-lg md:h-11" />
            <div className="skeleton h-4 w-1/2 rounded-lg" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="skeleton h-16 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
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
    </section>
  </MainLayout>
);

export default AnimeLoading;
