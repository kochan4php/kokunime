import WrappedContent from "@/components/wrapped-content";
import { Metadata } from "next";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Wrapped Tahunan",
  description: "Rekap tahunan aktivitas nonton: jumlah tersimpan, episode, rating, dan folder favorit.",
  alternates: { canonical: "/wrapped" },
  robots: { index: false },
};

const WrappedPage = (): JSX.Element => <WrappedContent />;

export default WrappedPage;
