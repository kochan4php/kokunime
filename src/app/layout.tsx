import { ChildrenProps } from "@/interfaces";
import NextTopLoader from "nextjs-toploader";
import { JSX } from "react";
import { Viewport } from "next";
import "./globals.css";

export { metadata } from "@/lib/metadata";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fdf5eb",
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":true;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

const RootLayout = ({ children }: ChildrenProps): JSX.Element => (
  <html lang="id" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
    </head>
    <body suppressHydrationWarning className="min-h-screen">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-22rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[130px]" />
        <div className="absolute -left-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-accent-2/10 blur-[130px]" />
        <div className="absolute right-[-12%] top-2/3 h-[30rem] w-[30rem] rounded-full bg-accent-amber/10 blur-[130px]" />
      </div>
      <NextTopLoader showSpinner={false} color="#8b5cf6" />
      {children}
    </body>
  </html>
);

export default RootLayout;
