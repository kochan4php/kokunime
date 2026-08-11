import { ChildrenProps } from "@/interfaces";
import NextTopLoader from "nextjs-toploader";
import ServiceWorkerRegister from "@/components/sw-register";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { JSX } from "react";
import { Viewport } from "next";
import "./globals.css";

export { metadata } from "@/lib/metadata";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fdf5eb",
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":true;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

const RootLayout = ({ children }: ChildrenProps): JSX.Element => (
  <html lang="id" className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    </head>
    <body suppressHydrationWarning className="min-h-screen">
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
