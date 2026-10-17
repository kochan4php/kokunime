import StatsContent from "@/components/stats-content";
import { Metadata } from "next";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Statistik Saya",
  description: "Ringkasan personal: jumlah tersimpan, episode ditandai, streak, distribusi rating, dan folder.",
  alternates: { canonical: "/stats" },
  robots: { index: false },
};

const StatsPage = (): JSX.Element => <StatsContent />;

export default StatsPage;
