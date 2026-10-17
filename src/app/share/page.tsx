import MainLayout from "@/layouts/main-layout";
import ShareTargetHandler from "@/components/share-target-handler";
import { Metadata } from "next";
import { JSX, Suspense } from "react";

export const metadata: Metadata = {
  title: "Simpan Tautan",
  description: "Simpan anime dari tautan yang dibagikan ke daftar tersimpan Kokunime.",
  robots: { index: false, follow: false },
};

const SharePage = (): JSX.Element => (
  <MainLayout>
    <Suspense
      fallback={
        <section className="container px-4 pt-10 pb-16">
          <p className="text-sm text-ink-muted">Memuat…</p>
        </section>
      }
    >
      <ShareTargetHandler />
    </Suspense>
  </MainLayout>
);

export default SharePage;
