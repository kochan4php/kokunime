import MainLayout from "@/layouts/main-layout";
import { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8 md:py-12 space-y-6">
        <div className="skeleton h-10 w-64 rounded-xl" />
        <div className="skeleton h-4 w-96 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    </MainLayout>
  );
}
