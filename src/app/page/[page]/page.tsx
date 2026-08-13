import HomeContent from "@/sections/home-content";
import HomeSkeleton from "@/sections/home-skeleton";
import MainLayout from "@/layouts/main-layout";
import { loadAnimePage } from "@/lib/loaders";
import { SITE_URL } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JSX, Suspense } from "react";

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

  const { anime = [], pagination } = await loadAnimePage(page);

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
