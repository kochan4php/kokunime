import { Quicksand, Nunito } from "next/font/google";

export const quicksand = Quicksand({
    subsets: ["latin"],
    variable: "--font-quicksand",
    display: "swap",
    preload: true,
});

export const nunito = Nunito({
    subsets: ["latin"],
    variable: "--font-nunito",
    display: "swap",
    preload: true,
});
