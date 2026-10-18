import ListingSkeleton from "@/sections/listing-skeleton";
import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <MainLayout>
      <div className="container px-4 pt-4">
        <div className="skeleton h-4 w-40 rounded-sm" />
      </div>
      <ListingSkeleton />
    </MainLayout>
  );
}
