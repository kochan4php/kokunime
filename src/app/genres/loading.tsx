import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

const GenresLoading = (): JSX.Element => (
  <MainLayout>
    <section className="container px-4 py-12 md:py-20" aria-label="Memuat daftar genre">
      <div className="skeleton h-3 w-24 rounded-full" />
      <div className="skeleton mt-3 h-8 w-48 rounded-lg" />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="card-shell">
            <div className="card-core h-14 p-4">
              <div className="skeleton h-4 w-2/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  </MainLayout>
);

export default GenresLoading;
