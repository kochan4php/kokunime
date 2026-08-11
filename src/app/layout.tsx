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
        <div className="absolute left-1/2 top-[-30rem] h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,var(--glow-accent)_0%,transparent_60%)] opacity-60" />
        <div className="absolute -left-40 top-1/4 h-[45rem] w-[45rem] rounded-full bg-[radial-gradient(circle_at_center,var(--glow-2)_0%,transparent_60%)] opacity-50" />
        <div className="absolute right-[-15%] top-1/2 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,var(--glow-amber)_0%,transparent_60%)] opacity-50" />
      </div>
      <NextTopLoader showSpinner={false} color="#8b5cf6" />
      <ServiceWorkerRegister />
      {children}
    </body>
  </html>
);

export default RootLayout;
