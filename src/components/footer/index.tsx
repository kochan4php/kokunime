import AboutBlock from "./about-block";
import BottomBar from "./bottom-bar";
import BrandBlock from "./brand-block";
import { footerNavLinks, footerDevLinks } from "./config";
import Link from "next/link";
import { JSX } from "react";

const Footer = (): JSX.Element => (
  <>
    <div className="nb-stripe" aria-hidden="true" />
    <footer className="relative overflow-hidden bg-surface-muted">
      <div
        aria-hidden
        className="nb-outline-text pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[5rem] font-black uppercase leading-none tracking-tight opacity-50 sm:text-[8rem] md:text-[11rem]"
      >
        Kokunime
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
  </>
);

export default Footer;
