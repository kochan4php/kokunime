import { ChildrenProps } from "@/interfaces";
import ServiceWorkerRegister from "@/components/sw-register";
import SpeculationRules from "@/components/speculation-rules";
import RouteProgressBar from "@/components/route-progress-bar";
import WebVitals from "@/components/web-vitals";
import Toaster from "@/components/toaster";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { JSX, Suspense } from "react";
import { Viewport } from "next";
import { buildWebSiteJsonLd, safeJsonLd } from "@/lib/seo";
import "./globals.css";
import { STORAGE_KEYS } from "@/utils/storage-keys";

export { metadata } from "@/lib/metadata";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fdf5eb",
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const themeScript = `(function(){try{var s={};try{s=JSON.parse(localStorage.getItem(STORAGE_KEYS.userSettings))||{};}catch(e){}var a=s.accent||localStorage.getItem(STORAGE_KEYS.accent);if(a&&a!=="orange")document.documentElement.setAttribute("data-accent",a);var f=s.font||localStorage.getItem(STORAGE_KEYS.font);if(f&&f!=="mono")document.documentElement.setAttribute("data-font",f);var fs=s.fontSize;if(fs&&fs!=="normal")document.documentElement.setAttribute("data-font-size",fs);if(s.density==="compact")document.documentElement.setAttribute("data-density","compact");var rm=s.reduceMotion!==undefined?s.reduceMotion:true;if(rm)document.documentElement.setAttribute("data-reduce-motion","true");if(s.readingMode&&s.readingMode!=="none")document.documentElement.setAttribute("data-reading-mode",s.readingMode);var n=s.nightShift||localStorage.getItem(STORAGE_KEYS.nightShift)==="true";if(n)document.documentElement.setAttribute("data-night-shift","true");}catch(e){}})();`;

const criticalCss = `body{background-color:var(--color-bg,#fdf5eb);color:var(--color-ink,#0a0a0a);}`;

const RootLayout = ({ children }: ChildrenProps): JSX.Element => (
  <html lang="id" className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
    <head>
      <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      <link rel="search" type="application/opensearchdescription+xml" title="Kokunime" href="/opensearch.xml" />
      <link rel="preconnect" href="https://kusonime.com" />
      <link rel="dns-prefetch" href="https://kusonime.com" />
      <link rel="preconnect" href="https://i0.wp.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://i0.wp.com" />
      <link rel="preconnect" href="https://i1.wp.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://i1.wp.com" />
      <link rel="preconnect" href="https://i2.wp.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://i2.wp.com" />
      <link rel="preconnect" href="https://i3.wp.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://i3.wp.com" />
    </head>
    <body suppressHydrationWarning className="min-h-screen">
      <script id="theme-script" dangerouslySetInnerHTML={{ __html: themeScript }} />
      <script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(buildWebSiteJsonLd()) }}
      />
      {/* Skip link: lets keyboard users jump past the navbar on every page. */}
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-surface-solid focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-[4px_4px_0_0_var(--border)]"
      >
        Langsung ke konten
      </a>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-16 h-56 w-56 rotate-12 border-[3px] border-border bg-nb-yellow shadow-[10px_10px_0_0_var(--border)]" />
        <div className="absolute right-1/4 -top-12 hidden h-28 w-28 rotate-45 border-[3px] border-border bg-nb-purple shadow-[8px_8px_0_0_var(--border)] sm:block" />
        <div className="absolute -right-16 top-1/3 h-40 w-40 -rotate-6 border-[3px] border-border bg-nb-pink" />
        <div className="absolute -bottom-20 left-1/4 h-52 w-52 rounded-full border-[3px] border-border bg-nb-teal" />
        <div className="absolute -left-8 bottom-1/4 hidden h-24 w-24 -rotate-12 border-[3px] border-border bg-nb-lime sm:block" />
        <div className="absolute bottom-8 right-10 h-14 w-14 rotate-6 border-[3px] border-border bg-nb-orange shadow-[6px_6px_0_0_var(--border)]" />
      </div>
      <ServiceWorkerRegister />
      <SpeculationRules />
      <WebVitals />
      <Toaster />
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
      {children}
    </body>
  </html>
);

export default RootLayout;
