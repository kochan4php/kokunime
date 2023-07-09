import { ChildrenProps } from "@/interfaces";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import "./globals.css";
import Loading from "./loading";

export const metadata = {
  title: "Kokunime",
  description: "Website download anime dan baca manga",
};

const RootLayout = ({ children }: ChildrenProps): JSX.Element => (
  <html lang="en" className="scroll-smooth">
    <body
      suppressHydrationWarning
      className="!overflow-x-hidden bg-gradient-to-tl from-slate-900 via-slate-800 to-slate-900 min-h-screen flex flex-col justify-between"
    >
      <NextTopLoader showSpinner={false} />
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </body>
  </html>
);

export default RootLayout;
