"use client";

import { siteLinks } from "@/components/site-config";
import { useTranslation, TranslationKey } from "@/utils/i18n";
import PwaInstallButton from "@/components/pwa-install-button";
import Link from "next/link";
import { JSX, useEffect, useRef, useState } from "react";

interface MobileMenuProps {
  isActive: (href: string) => boolean;
}

const NAV_KEY_MAP: Record<string, TranslationKey> = {
  "/": "nav.home",
  "/genres": "nav.genres",
  "/seasons": "nav.seasons",
  "/bookmarks": "nav.bookmarks",
  "/compare": "nav.compare",
  "/settings": "nav.settings",
};

const MobileMenu = ({ isActive }: MobileMenuProps): JSX.Element => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const { t } = useTranslation();

  const openMenu = () => {
    setIsClosing(false);
    dialogRef.current?.showModal();
  };

  const closeMenu = () => {
    if (isClosing || !dialogRef.current?.open) return;
    setIsClosing(true);
    setTimeout(() => {
      dialogRef.current?.close();
      setIsClosing(false);
    }, 180);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dialogRef.current?.open) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Mobile & Tablet Hamburger Button Trigger */}
      <button
        type="button"
        onClick={openMenu}
        aria-label={t("nav.open_menu")}
        title={t("nav.open_menu")}
        className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-border bg-nb-yellow text-[#0a0a0a] shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none lg:hidden cursor-pointer shrink-0"
      >
        <span aria-hidden className="menu-icon">
          <span className="menu-line" />
          <span className="menu-line" />
          <span className="menu-line" />
        </span>
      </button>

      {/* Modal Dialog */}
      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          closeMenu();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeMenu();
        }}
        className={`fixed inset-x-0 top-4 sm:top-[8%] mx-auto w-[92vw] sm:w-[88vw] max-w-lg max-h-[85vh] bg-surface-solid p-0 text-ink overflow-hidden ${
          isClosing ? "is-closing" : ""
        }`}
      >
        <div className="flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-border bg-nb-cream px-4 py-3 sm:px-5 shrink-0 dark:bg-surface-muted">
            <div className="flex items-center gap-2">
              <span className="chip">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Kokunime
              </span>
              <span className="font-display text-sm font-bold text-ink">{t("nav.open_menu")}</span>
            </div>
            <button
              type="button"
              onClick={closeMenu}
              className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-surface font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <span className="sr-only">{t("nav.close_menu")}</span>
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto p-3.5 sm:p-4 space-y-4 [scrollbar-width:thin] flex-1 min-h-0">
            {/* Primary Navigation Cards */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">{t("nav.open_menu")}</p>
              <nav aria-label="Menu Dialog" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {siteLinks.map((link) => {
                  const active = isActive(link.href);
                  const navKey = NAV_KEY_MAP[link.href];
                  const label = navKey ? t(navKey) : link.label;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-sm text-xs sm:text-sm font-medium transition-all duration-150 border-2 ${
                        active
                          ? "bg-accent border-border text-(--accent-ink) font-bold shadow-[2px_2px_0_0_var(--border)]"
                          : "border-transparent bg-transparent text-ink-muted hover:border-border hover:bg-surface hover:text-ink"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">{link.icon}</span>
                        <span className={`${active ? "" : "text-ink"} font-semibold truncate`}>{label}</span>
                      </div>
                      {link.badge ? (
                        <span className="rounded-sm border border-border bg-nb-yellow px-2 py-0.5 font-mono text-[10px] font-bold text-[#0a0a0a] shrink-0">
                          {link.badge}
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-ink-muted shrink-0">→</span>
                      )}
                    </Link>
                  );
                })}

                {/* Random Anime Shortcut */}
                <a
                  href="/api/random"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3.5 py-3 rounded-sm text-xs sm:text-sm font-medium transition-all duration-150 border-2 border-transparent bg-transparent text-ink-muted hover:border-border hover:bg-surface hover:text-ink sm:col-span-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🎲</span>
                    <span className="text-ink font-semibold">{t("nav.random_anime")}</span>
                  </div>
                  <span className="font-mono text-xs text-accent-text font-bold">↵</span>
                </a>
              </nav>
            </div>

            {/* App Install Banner */}
            <PwaInstallButton />
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t-2 border-border bg-surface-muted px-4 py-2 text-[11px] text-ink-muted font-mono">
            <span>Kokunime Navigation</span>
            <span>Esc</span>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MobileMenu;
