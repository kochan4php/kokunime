"use client";

import SearchForm from "./search-form";
import ThemeToggle from "./theme-toggle";
import MobileMenu from "./mobile-menu";
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

  // "/" focuses the search box (ignore when typing in a field).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.matches?.("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
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
                aria-current={isActive(link.href) ? "page" : undefined}
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
          <MobileMenu open={open} onOpenChange={setOpen} isActive={isActive} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
