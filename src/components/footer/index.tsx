import AboutBlock from "./about-block";
import BottomBar from "./bottom-bar";
import BrandBlock from "./brand-block";
import { footerNavLinks, footerDevLinks } from "./config";
import Link from "next/link";
import { JSX } from "react";

const Footer = (): JSX.Element => (
  <footer className="relative overflow-hidden border-t border-border bg-bg/50 backdrop-blur-xs">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-60"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[13rem] font-extrabold leading-none tracking-tight text-ink/[0.03] md:text-[18rem]"
    >
      Koku
    </div>
    <div className="container relative px-4 pb-20 pt-12 sm:pb-16 sm:pt-14 md:px-6 md:pb-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <BrandBlock />
        <div>
          <span className="chip">Navigasi</span>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm font-medium">
            {footerNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-muted transition-colors duration-200 hover:text-accent hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="chip">Developer & Feed</span>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm font-mono">
            {footerDevLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.href.includes(".xml") || link.href.includes(".json") ? "_blank" : undefined}
                  rel={link.href.includes(".xml") || link.href.includes(".json") ? "noopener noreferrer" : undefined}
                  className="text-ink-muted transition-colors duration-200 hover:text-accent hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <AboutBlock />
      </div>
      <BottomBar />
    </div>
  </footer>
);

export default Footer;
