import { ChildrenProps } from "@/interfaces";
import ServiceWorkerRegister from "@/components/sw-register";
import RouteProgressBar from "@/components/route-progress-bar";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { JSX, Suspense } from "react";
import { Viewport } from "next";
import { buildWebSiteJsonLd, safeJsonLd } from "@/lib/seo";
import "./globals.css";

export { metadata } from "@/lib/metadata";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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

const themeScript = `(function(){try{var s={};try{s=JSON.parse(localStorage.getItem("kokunime_user_settings"))||{};}catch(e){}var t=s.theme||localStorage.getItem("theme");var d=t==="dark"||t==="oled"||(!t&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);var c=s.theme==="oled"?"oled":localStorage.getItem("kokunime_contrast");if(c==="oled")document.documentElement.setAttribute("data-contrast","oled");var a=s.accent||localStorage.getItem("kokunime_accent");if(a&&a!=="orange")document.documentElement.setAttribute("data-accent",a);var f=s.font||localStorage.getItem("kokunime_font");if(f&&f!=="mono")document.documentElement.setAttribute("data-font",f);var fs=s.fontSize;if(fs&&fs!=="normal")document.documentElement.setAttribute("data-font-size",fs);var rm=s.reduceMotion!==undefined?s.reduceMotion:true;if(rm)document.documentElement.setAttribute("data-reduce-motion","true");if(s.glassEffects===false)document.documentElement.setAttribute("data-glass","false");if(s.readingMode&&s.readingMode!=="none")document.documentElement.setAttribute("data-reading-mode",s.readingMode);var n=s.nightShift||localStorage.getItem("kokunime_night_shift")==="true";if(n)document.documentElement.setAttribute("data-night-shift","true");var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m);}m.content=c==="oled"?"#000000":d?"#201613":"#fdf5eb";}catch(e){}})();`;

const criticalCss = `body{background-color:var(--color-bg,#0a0a0c);color:var(--color-ink,#fdf5eb);}`;

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
      <script
        id="theme-script"
        dangerouslySetInnerHTML={{ __html: themeScript }}
      />
      <script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(buildWebSiteJsonLd()) }}
      />
      {/* Skip link: lets keyboard users jump past the navbar on every page. */}
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-surface-solid focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-lg"
      >
        Langsung ke konten
      </a>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="blob1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="blob2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent-2)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--color-accent-2)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="blob3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent-amber)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--color-accent-amber)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="-10%" r="40%" fill="url(#blob1)" />
          <circle cx="-10%" cy="25%" r="35%" fill="url(#blob2)" />
          <circle cx="110%" cy="50%" r="30%" fill="url(#blob3)" />
        </svg>
      </div>
      <ServiceWorkerRegister />
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
      {children}
    </body>
  </html>
);

export default RootLayout;
