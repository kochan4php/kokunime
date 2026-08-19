import HomeSkeleton from "@/sections/home-skeleton";
import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <MainLayout>
      <HomeSkeleton />
    </MainLayout>
  );
}
