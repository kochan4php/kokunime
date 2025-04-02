import "@/app/globals.css";
import Navbar from "@/components/navbar";
import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import { cn } from "../lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={cn(`min-h-screen font-sans antialiased !overflow-x-hidden nunito`)}>
        <ThemeProvider defaultTheme="dark" attribute="class" enableColorScheme>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
