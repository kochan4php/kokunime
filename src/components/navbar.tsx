"use client";

import SearchForm from "./search-form";
import ThemeToggle from "./theme-toggle";
import { siteLinks } from "@/components/site-config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useEffect, useState } from "react";

const Navbar = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`navbar sticky top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-bg/85 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-tight text-ink transition-all duration-300 hover:opacity-80"
          >
            <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-amber bg-clip-text text-transparent">
              Koku
            </span>
            nime
          </Link>

          <nav aria-label="Utama" className="hidden items-center gap-1 lg:flex">
            {siteLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full border ${
                  isActive(link.href)
                    ? "bg-accent/5 border-accent/20 shadow-[0_0_8px_var(--glow-accent)] text-ink"
                    : "border-transparent text-ink-muted hover:bg-surface hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <SearchForm
            className="hidden md:block"
            inputClassName="w-60 pl-10 lg:w-72 bg-surface border border-accent/50 focus:border-accent"
          />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-accent/50 text-accent transition-all duration-300 hover:border-accent hover:bg-accent/10 lg:hidden"
          >
            <span aria-hidden className={`menu-icon ${open ? "menu-open" : ""}`}>
              <span className="menu-line" />
              <span className="menu-line" />
              <span className="menu-line" />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        aria-hidden={!open}
        className={`absolute inset-x-0 top-full border-b border-border bg-bg/95 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-4 opacity-0"
        }`}
      >
        <div className="container px-4 pb-6 pt-2 md:px-6">
          <div className="md:hidden mb-4">
            <SearchForm
              inputClassName="w-full pl-10 bg-surface border border-accent/50 focus:border-accent"
              onSubmit={() => setOpen(false)}
            />
          </div>
          <nav aria-label="Menu" className="flex flex-col space-y-1">
            {siteLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                  isActive(link.href)
                    ? "bg-accent/5 border-accent/20 shadow-[0_0_8px_var(--glow-accent)] text-ink"
                    : "border-transparent text-ink-muted hover:bg-surface hover:text-ink"
                }`}
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
