import { ChildrenProps } from "@/interfaces";
import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import NextTopLoader from "nextjs-toploader";
import { JSX, Suspense } from "react";
import "./globals.css";
import Loading from "./loading";

const openGraph: OpenGraph = {
  title: "Kokunime",
  description: "Website buat download anime dan baca manga tanpa iklan 😎",
  url: "https://kokunime.netlify.app",
  siteName: "Kokunime",
  images: [{ url: "/farhan-kebab.jpg", alt: "Alt nya kalo preview gambarnya ga ada hehe" }],
  locale: "en_US",
  type: "website",
};

export const metadata: Metadata = {
  title: "Kokunime",
  metadataBase: new URL("https://kokunime.netlify.app"),
  description: "Website download anime dan baca manga",
  openGraph,
};

const RootLayout = ({ children }: ChildrenProps): JSX.Element => (
  <html lang="en" className="scroll-smooth">
    <body
      suppressHydrationWarning
      className="!overflow-x-hidden bg-gradient-to-tl from-slate-900 via-slate-800 to-slate-900 min-h-screen flex flex-col justify-between"
    >
      <NextTopLoader showSpinner={true} />
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </body>
  </html>
);

export default RootLayout;
