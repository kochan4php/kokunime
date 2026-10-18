"use client";

import CommandPalette from "./command-palette";
import InboxBell from "./inbox-bell";
import MobileMenu from "./mobile-menu";
import { siteLinks } from "@/components/site-config";
import { useTranslation, TranslationKey } from "@/utils/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";

const NAV_KEY_MAP: Record<string, TranslationKey> = {
  "/": "nav.home",
  "/genres": "nav.genres",
  "/seasons": "nav.seasons",
  "/bookmarks": "nav.bookmarks",
  "/compare": "nav.compare",
  "/settings": "nav.settings",
};

// Factual, short claims only — long enough to fill the loop, never invented.
const TICKER_ITEMS = [
  "🔥 Update anime tiap hari",
  "🎬 Batch + episode, subtitle Indonesia",
  "🔎 Ctrl+K untuk pencarian cepat",
  "⌨️ Tekan ? untuk daftar pintasan",
  "🎲 Tombol dadu untuk anime acak",
];

// Ink masthead: ticker and navigation share one black band, always-on (no
// scroll state) so the chrome never flashes. The footer closes every page
// with the same ink band; content in between stays paper.
const Navbar = (): JSX.Element => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="navbar sticky top-0 z-50 bg-ink">
      <div className="nb-ticker">
        <div className="nb-ticker-track">
          <div className="nb-ticker-group">
            {TICKER_ITEMS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="nb-ticker-group" aria-hidden="true">
            {TICKER_ITEMS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-8 min-w-0">
          <Link
            href="/"
            className="font-display text-2xl font-black tracking-tight text-nb-cream transition-transform duration-200 hover:-rotate-1 shrink-0"
          >
            <span className="inline-block -rotate-2 border-2 border-border bg-nb-yellow px-1.5 text-[#0a0a0a] shadow-[2px_2px_0_0_var(--border)]">
              Koku
            </span>
            nime
          </Link>

          <nav aria-label="Utama" className="hidden lg:flex items-center gap-1.5">
            {siteLinks.map((link) => {
              const navKey = NAV_KEY_MAP[link.href];
              const label = navKey ? t(navKey) : link.label;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold transition-all duration-200 rounded-sm border-2 ${
                    isActive(link.href)
                      ? "bg-accent border-nb-cream text-(--accent-ink) font-bold"
                      : "border-transparent text-nb-cream/75 hover:border-nb-cream hover:bg-nb-cream hover:text-ink"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{label}</span>
                  {link.badge && (
                    <span className="rounded-sm border border-border bg-nb-pink px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#0a0a0a]">
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
            className="hidden lg:inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--border)] active:translate-y-0 active:shadow-none cursor-pointer"
          >
            <span>🎲 {t("nav.random")}</span>
          </a>
          <CommandPalette />
          <InboxBell />
          <MobileMenu isActive={isActive} />
        </div>
      </div>

      <div className="nb-stripe" aria-hidden="true" />
    </header>
  );
};

export default Navbar;
