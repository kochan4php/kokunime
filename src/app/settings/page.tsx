import SettingsPageContent from "@/components/settings-page-content";
import MainLayout from "@/layouts/main-layout";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import { Metadata } from "next";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Pengaturan & Kustomisasi · Kokunime",
  description: "Atur tema, mode tampilan, warna aksen, font, mode baca sinopsis, dan kelola data penyimpanan lokal Anda.",
  alternates: { canonical: "/settings" },
  openGraph: {
    title: "Pengaturan & Kustomisasi · Kokunime",
    description: "Atur tema, mode tampilan, warna aksen, font, dan kelola data penyimpanan lokal Anda.",
    url: "/settings",
  },
};

const SettingsPage = (): JSX.Element => {
  return (
    <MainLayout>
      <script
        id="settings-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(buildSubpageBreadcrumbJsonLd([{ name: "Pengaturan", url: "/settings" }])),
        }}
        suppressHydrationWarning
      />
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
        <SettingsPageContent />
      </section>
    </MainLayout>
  );
};

export default SettingsPage;
