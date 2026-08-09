import FeaturedHero from "@/sections/featured-hero";
import LatestGrid from "@/sections/latest-grid";
import RecommendationSection from "@/sections/recommendation-section";
import { getAnimePerPage } from "@/lib/api-client";
import { buildWebSiteJsonLd } from "@/lib/seo";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";
import { JSX } from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Download Anime Subtitle Indonesia · Kokunime",
    description: "Kumpulan link download anime batch dan episode, semua dengan subtitle Indonesia.",
    alternates: { canonical: "/", languages: { "id-ID": "/" } },
  };
}
const Home = async ({ searchParams }: any): Promise<JSX.Element> => {
  const page = Number((await searchParams)?.page) || 1;
  const { anime: latestAnime = [], pagination } = await getAnimePerPage(page);

  return (
    <MainLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSiteJsonLd()) }} />
      <section className="container px-4 pt-6 md:pt-10">
        <FeaturedHero featured={latestAnime[0]} />
      </section>
      <LatestGrid anime={latestAnime} pagination={pagination} />
      <RecommendationSection />
    </MainLayout>
  );
};

export default Home;
