import HomeContent from "@/sections/home-content";
import HomeSkeleton from "@/sections/home-skeleton";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX, Suspense } from "react";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const page = (await params).page;
  return {
    title: `Download Anime Subtitle Indonesia - Halaman ${page} · Kokunime`,
    description: `Kumpulan link download anime batch dan episode, semua dengan subtitle Indonesia. Halaman ${page}.`,
  };
}

const PaginatedHome = async ({ params }: any): Promise<JSX.Element> => {
  const page = Number((await params).page);

  if (isNaN(page) || page < 2) {
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
