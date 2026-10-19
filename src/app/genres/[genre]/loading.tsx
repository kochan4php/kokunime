import MainLayout from "@/layouts/main-layout";
import ListingSkeleton from "@/sections/listing-skeleton";
import { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <MainLayout>
      <ListingSkeleton breadcrumb pagination />
    </MainLayout>
  );
}
