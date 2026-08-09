import ListingSkeleton from "@/sections/listing-skeleton";
import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

const GenreLoading = (): JSX.Element => (
  <MainLayout>
    <ListingSkeleton />
  </MainLayout>
);

export default GenreLoading;
