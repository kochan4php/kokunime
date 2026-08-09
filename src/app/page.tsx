import HomeContent from "@/sections/home-content";
import HomeSkeleton from "@/sections/home-skeleton";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX, Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Download Anime Subtitle Indonesia · Kokunime",
    description: "Kumpulan link download anime batch dan episode, semua dengan subtitle Indonesia.",
    alternates: { canonical: "/", languages: { "id-ID": "/" } },
  };
}

const Home = async ({ searchParams }: any): Promise<JSX.Element> => {
  const page = Number((await searchParams)?.page) || 1;

  return (
    <MainLayout>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent page={page} />
      </Suspense>
    </MainLayout>
  );
};

export default Home;
