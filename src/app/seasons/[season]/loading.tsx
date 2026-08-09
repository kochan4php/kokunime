import ListingSkeleton from "@/sections/listing-skeleton";
import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

const SeasonLoading = (): JSX.Element => (
  <MainLayout>
    <ListingSkeleton />
  </MainLayout>
);

export default SeasonLoading;
