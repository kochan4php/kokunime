import HomeSkeleton from "@/sections/home-skeleton";
import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

const Loading = (): JSX.Element => (
  <MainLayout>
    <HomeSkeleton />
  </MainLayout>
);

export default Loading;
