import AboutBlock from "./about-block";
import BottomBar from "./bottom-bar";
import BrandBlock from "./brand-block";
import { JSX } from "react";

const Footer = (): JSX.Element => (
  <footer className="relative overflow-hidden border-t border-border">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -top-28 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,var(--glow-accent)_0%,transparent_70%)] opacity-70"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[13rem] font-extrabold leading-none tracking-tight text-ink/[0.03] md:text-[18rem]"
    >
      Koku
    </div>
    <div className="container relative px-4 pb-24 pt-16 md:px-6 md:pb-8">
      <div className="grid gap-10 md:grid-cols-2">
        <BrandBlock />
        <AboutBlock />
      </div>
      <BottomBar />
    </div>
  </footer>
);

export default Footer;
