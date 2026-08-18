import DetailSkeleton from "@/components/anime/detail-skeleton";
import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <MainLayout>
      <section className="container px-4 pb-8 pt-12 md:pb-12 md:pt-16">
        <DetailSkeleton />
      </section>
    </MainLayout>
  );
}
