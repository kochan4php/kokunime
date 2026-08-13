import HomeContent from "@/sections/home-content";
import HomeSkeleton from "@/sections/home-skeleton";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX, Suspense } from "react";

// Dynamic: featured/recommended/latest-series data changes constantly on the
// upstream — a build-time static home would show stale picks until deploy.
// unstable_cache (cache.ts) still dedupes the upstream fetches (15-30m TTL).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Download Anime Subtitle Indonesia · Kokunime",
    description: "Kumpulan link download anime batch dan episode, semua dengan subtitle Indonesia.",
    alternates: { canonical: "/", languages: { "id-ID": "/" } },
  };
}

const Home = async (): Promise<JSX.Element> => {
  return (
    <MainLayout>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent page={1} basePath="/page" />
      </Suspense>
    </MainLayout>
  );
};

export default Home;
