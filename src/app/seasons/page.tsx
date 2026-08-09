import { getSeasons } from "@/lib/api-client";
import { buildPaginationInfo } from "@/utils/pagination";
import { endpointSlug } from "@/utils/endpoint-slug";
import { groupSeasonsByYear, orderYears } from "@/utils/seasons";
import TaxonomyCard from "@/sections/taxonomy-card";
import PaginationBar from "@/sections/pagination/bar";
import MainLayout from "@/layouts/main-layout";
import Reveal from "@/components/reveal";
import { Metadata } from "next";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Daftar Musim Anime",
  description: "Jelajahi anime berdasarkan musim rilis.",
  alternates: { canonical: "/seasons", languages: { "id-ID": "/seasons" } },
};

const YEARS_PER_PAGE = 4;

const SeasonsPage = async ({ searchParams }: any): Promise<JSX.Element> => {
  const seasons = (await getSeasons()) ?? [];
  const groups = groupSeasonsByYear(seasons);
  const years = orderYears(groups);

  const requestedPage = Number((await searchParams)?.page) || 1;
  const totalPages = Math.max(1, Math.ceil(years.length / YEARS_PER_PAGE));
  const current = Math.min(requestedPage, totalPages);
  const pageYears = years.slice((current - 1) * YEARS_PER_PAGE, current * YEARS_PER_PAGE);

  return (
    <MainLayout>
      <section className="container px-4 py-12 md:py-20">
        <Reveal>
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Season
          </span>
          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-4xl">
            Daftar Musim
          </h1>
        </Reveal>
        <div className="mt-10 space-y-12">
          {pageYears.map((year) => (
            <div key={year}>
              <Reveal>
                <h2 className="mb-4 font-display text-xl font-bold tracking-tight text-ink">{year}</h2>
              </Reveal>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {groups[year].map((season) => {
                  const slug = endpointSlug(season.endpoint, "seasons");
                  if (!slug) return null;

                  return <TaxonomyCard key={slug} href={`/seasons/${slug}`} title={season.name} meta="Musim" />;
                })}
              </div>
            </div>
          ))}
        </div>
        <PaginationBar pagination={buildPaginationInfo(current, totalPages)} />
      </section>
    </MainLayout>
  );
};

export default SeasonsPage;
