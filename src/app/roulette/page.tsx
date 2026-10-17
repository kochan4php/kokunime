import RouletteContent from "@/components/roulette-content";
import { SITE_URL } from "@/lib/site";
import { Metadata } from "next";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Roulette Anime",
  description: "Bingung mau nonton apa? Putar roulette anime dengan filter genre favoritmu.",
  alternates: { canonical: "/roulette" },
  openGraph: {
    title: "Roulette Anime · Kokunime",
    description: "Putar roulette dan temukan tontonan berikutnya.",
    url: `${SITE_URL}/roulette`,
  },
};

const RoulettePage = (): JSX.Element => <RouletteContent />;

export default RoulettePage;
