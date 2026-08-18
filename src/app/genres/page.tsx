import { getGenres } from "@/services/scraper";
import { SITE_URL } from "@/lib/site";
import { buildPaginationInfo } from "@/utils/pagination";
import { endpointSlug } from "@/utils/endpoint-slug";
import TaxonomyCard from "@/sections/taxonomy-card";
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
  const canonical = page > 1 ? `/genres?page=${page}` : "/genres";

  return {
    title: "Daftar Genre Anime",
    description: "Jelajahi anime berdasarkan genre.",
    alternates: { canonical, languages: { "id-ID": canonical } },
    openGraph: { title: "Daftar Genre Anime", url: `${SITE_URL}${canonical}` },
  };
}

const PAGE_SIZE = 24;

const GenresPage = async ({ searchParams }: { searchParams: Promise<{ page?: string }> }): Promise<JSX.Element> => {
  const genres = (await getGenres()) ?? [];
  const requestedPage = Number((await searchParams)?.page) || 1;
  // clamp both ends: negative page params slice from the array END
  // (slice(-48,-24) is the last page) while title/canonical claim page 1
  const totalPages = Math.max(1, Math.ceil(genres.length / PAGE_SIZE));
  const current = Math.min(Math.max(requestedPage, 1), totalPages);
  const pageGenres = genres.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16">
        {/* No Reveal on the h1 — it is the LCP element here. */}
        <span className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Genre
        </span>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-4xl">Daftar Genre</h1>
        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {pageGenres.map((genre) => {
            const slug = endpointSlug(genre.endpoint, "genres");
            if (!slug) return null;

            return <TaxonomyCard key={slug} href={`/genres/${slug}`} title={genre.name} dot />;
          })}
        </div>
        <Pagination pagination={buildPaginationInfo(current, totalPages)} />
      </section>
    </MainLayout>
  );
};

export default GenresPage;
