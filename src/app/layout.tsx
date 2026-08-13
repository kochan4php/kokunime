import { ChildrenProps } from "@/interfaces";
import NextTopLoader from "nextjs-toploader";
import ServiceWorkerRegister from "@/components/sw-register";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { JSX } from "react";
import { Viewport } from "next";
import { buildWebSiteJsonLd, safeJsonLd } from "@/lib/seo";
import "./globals.css";

export { metadata } from "@/lib/metadata";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Required for env(safe-area-inset-bottom) to be non-zero on iOS: without
  // viewport-fit=cover Safari reports 0 inset, so the sticky CTA's safe-area
  // padding (section-detail) silently does nothing on iPhones.
  viewportFit: "cover",
  // theme-color is set dynamically by the theme script + toggle (must match
  // the ACTUAL applied theme, not the OS preference).
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m);}m.content=d?"#201613":"#fdf5eb";}catch(e){}})();`;

const RootLayout = ({ children }: ChildrenProps): JSX.Element => (
  <html lang="id" className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(buildWebSiteJsonLd()) }} />
    </head>
    <body suppressHydrationWarning className="min-h-screen">
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
      <NextTopLoader showSpinner={false} color="var(--accent)" />
      <ServiceWorkerRegister />
      {children}
    </body>
  </html>
);

export default RootLayout;
