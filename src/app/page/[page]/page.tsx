import HomeContent from "@/sections/home-content";
import HomeSkeleton from "@/sections/home-skeleton";
import MainLayout from "@/layouts/main-layout";
import { getAnimePerPage } from "@/services/scraper";
import { SITE_URL } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JSX, Suspense } from "react";

// On-demand ISR (5 min): every visitor sees the same listing, so the render
// is cached after the first hit instead of re-running per request.
// Empty param list = no build-time prerender.
export const revalidate = 300;

export function generateStaticParams(): { page: string }[] {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const page = Number((await params).page);

  if (isNaN(page) || page < 2) {
    notFound();
  }

  return {
    title: `Download Anime Subtitle Indonesia · Halaman ${page}`,
    description: `Kumpulan link download anime batch dan episode, semua dengan subtitle Indonesia. Halaman ${page}.`,
    alternates: { canonical: `/page/${page}` },
    openGraph: {
      title: `Download Anime Subtitle Indonesia · Halaman ${page}`,
      url: `${SITE_URL}/page/${page}`,
    },
  };
}

const PaginatedHome = async ({ params }: { params: Promise<{ page: string }> }): Promise<JSX.Element> => {
  const page = Number((await params).page);

  if (isNaN(page) || page < 2) {
    notFound();
  }

  const { anime = [], pagination } = await getAnimePerPage(page);

  if (anime.length === 0 || pagination?.current_page !== page) {
    notFound();
  }

  return (
    <MainLayout>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent page={page} basePath="/page" />
      </Suspense>
    </MainLayout>
  );
};

export default PaginatedHome;
