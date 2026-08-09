import { getGenres } from "@/lib/api-client";
import { buildPaginationInfo } from "@/utils/pagination";
import { endpointSlug } from "@/utils/endpoint-slug";
import TaxonomyCard from "@/sections/taxonomy-card";
import PaginationBar from "@/sections/pagination/bar";
import MainLayout from "@/layouts/main-layout";
import Reveal from "@/components/reveal";
import { Metadata } from "next";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Daftar Genre Anime",
  description: "Jelajahi anime berdasarkan genre.",
  alternates: { canonical: "/genres", languages: { "id-ID": "/genres" } },
};

const PAGE_SIZE = 24;

const GenresPage = async ({ searchParams }: any): Promise<JSX.Element> => {
  const genres = (await getGenres()) ?? [];
  const requestedPage = Number((await searchParams)?.page) || 1;
  const totalPages = Math.max(1, Math.ceil(genres.length / PAGE_SIZE));
  const current = Math.min(requestedPage, totalPages);
  const pageGenres = genres.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <MainLayout>
      <section className="container px-4 py-12 md:py-20">
        <Reveal>
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Genre
          </span>
          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-4xl">
            Daftar Genre
          </h1>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {pageGenres.map((genre) => {
            const slug = endpointSlug(genre.endpoint, "genres");
            if (!slug) return null;

            return <TaxonomyCard key={slug} href={`/genres/${slug}`} title={genre.name} dot />;
          })}
        </div>
        <PaginationBar pagination={buildPaginationInfo(current, totalPages)} />
      </section>
    </MainLayout>
  );
};

export default GenresPage;
