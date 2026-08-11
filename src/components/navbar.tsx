"use client";

import SearchForm from "./search-form";
import ThemeToggle from "./theme-toggle";
import { siteLinks } from "@/components/site-config";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";

const Navbar = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`navbar sticky top-0 z-50 border-b border-border backdrop-blur-xl transition-[box-shadow,background-color] duration-300 ${
        scrolled ? "bg-bg/90 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]" : "bg-bg/80"
      }`}
    >
      <div className="container flex items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-7">
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-tight text-ink transition-all duration-300 hover:text-ink-muted"
          >
            <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-amber bg-clip-text text-transparent">
              Koku
            </span>
            nime
          </Link>
          <nav aria-label="Utama" className="hidden items-center gap-5 lg:flex">
            {siteLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <SearchForm className="hidden md:block" inputClassName="w-60 pl-10 lg:w-72" />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            className="glass inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-all duration-300 hover:text-accent lg:hidden"
          >
            <span aria-hidden className={`menu-icon ${open ? "menu-open" : ""}`}>
              <span className="menu-line" />
              <span className="menu-line" />
              <span className="menu-line" />
            </span>
          </button>
        </div>
      </div>
      <div
        aria-hidden={!open}
        className={`absolute inset-x-0 top-full border-b border-border bg-bg/95 backdrop-blur-xl transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="container px-4 pb-4 md:px-6">
          <div className="md:hidden">
            <SearchForm inputClassName="w-full pl-10" onSubmit={() => setOpen(false)} />
          </div>
          <nav aria-label="Menu" className="mt-3 flex flex-col">
            {siteLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-t border-border py-3 text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
