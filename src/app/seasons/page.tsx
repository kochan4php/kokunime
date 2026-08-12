import { loadSeasons } from "@/lib/loaders";
import { buildPaginationInfo } from "@/utils/pagination";
import { groupSeasonsByYear, orderYears } from "@/utils/seasons";
import SeasonYearGroup from "@/sections/season-year-group";
import Pagination from "@/sections/pagination";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX } from "react";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const page = Number((await searchParams)?.page) || 1;
  const canonical = page > 1 ? `/seasons?page=${page}` : "/seasons";

  return {
    title: "Daftar Musim Anime",
    description: "Jelajahi anime berdasarkan musim rilis.",
    alternates: { canonical, languages: { "id-ID": canonical } },
  };
}

const YEARS_PER_PAGE = 4;

const SeasonsPage = async ({ searchParams }: { searchParams: Promise<{ page?: string }> }): Promise<JSX.Element> => {
  const seasons = await loadSeasons();
  const groups = groupSeasonsByYear(seasons);
  const years = orderYears(groups);

  const requestedPage = Number((await searchParams)?.page) || 1;
  const totalPages = Math.max(1, Math.ceil(years.length / YEARS_PER_PAGE));
  const current = Math.min(requestedPage, totalPages);
  const pageYears = years.slice((current - 1) * YEARS_PER_PAGE, current * YEARS_PER_PAGE);

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16">
        {/* No Reveal on the h1 — it is the LCP element here. */}
        <span className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Season
        </span>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-4xl">Daftar Musim</h1>
        <div className="mt-10 space-y-12">
          {pageYears.map((year) => (
            <SeasonYearGroup key={year} year={year} seasons={groups[year]} />
          ))}
        </div>
        <Pagination pagination={buildPaginationInfo(current, totalPages)} />
      </section>
    </MainLayout>
  );
};

export default SeasonsPage;
