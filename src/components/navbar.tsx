"use client";

import CommandPalette from "./command-palette";
import MobileMenu from "./mobile-menu";
import { siteLinks } from "@/components/site-config";
import { useTranslation, TranslationKey } from "@/utils/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useEffect, useState } from "react";

const NAV_KEY_MAP: Record<string, TranslationKey> = {
  "/": "nav.home",
  "/genres": "nav.genres",
  "/seasons": "nav.seasons",
  "/bookmarks": "nav.bookmarks",
  "/compare": "nav.compare",
  "/settings": "nav.settings",
};

const Navbar = (): JSX.Element => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

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
        scrolled
          ? "bg-surface-solid/95 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
          : "bg-surface-solid/80 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-b border-border/40 sm:border-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-8 min-w-0">
          <Link
            href="/"
            className="font-display text-2xl font-black tracking-tight text-ink transition-all duration-200 hover:opacity-85 shrink-0"
          >
            <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-amber bg-clip-text text-transparent">
              Koku
            </span>
            nime
          </Link>

          <nav aria-label="Utama" className="hidden lg:flex items-center gap-1.5">
            {siteLinks.map((link) => {
              const label = NAV_KEY_MAP[link.href] ? t(NAV_KEY_MAP[link.href]) : link.label;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold transition-all duration-200 rounded-full border ${
                    isActive(link.href)
                      ? "bg-accent/10 border-accent/30 text-accent font-bold"
                      : "border-transparent text-ink-muted hover:border-border hover:bg-surface hover:text-ink"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{label}</span>
                  {link.badge && (
                    <span className="rounded-full bg-accent/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-accent">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <a
            href="/api/random"
            title={t("nav.random_anime")}
            className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted transition-all hover:border-accent hover:text-ink active:scale-95 cursor-pointer"
          >
            <span>🎲 {t("nav.random")}</span>
          </a>
          <CommandPalette />
          <MobileMenu isActive={isActive} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
