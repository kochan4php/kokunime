import ListingSkeleton from "@/sections/listing-skeleton";
import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16">
        <ListingSkeleton />
      </section>
    </MainLayout>
  );
}
