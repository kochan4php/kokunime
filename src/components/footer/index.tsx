import AboutBlock from "./about-block";
import BottomBar from "./bottom-bar";
import BrandBlock from "./brand-block";
import NavLinks from "./nav-links";
import { JSX } from "react";

const Footer = (): JSX.Element => (
  <footer className="relative overflow-hidden border-t border-border">
    <div
      aria-hidden
      className="pointer-events-none absolute -top-28 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
    />
    <div className="container relative px-4 pb-8 pt-16 md:px-6">
      <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <BrandBlock />
        <NavLinks />
        <AboutBlock />
      </div>
      <BottomBar />
    </div>
  </footer>
);

export default Footer;
