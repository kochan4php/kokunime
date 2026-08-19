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
        className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/50 bg-surface text-accent transition-all duration-200 hover:border-accent hover:bg-accent/10 active:scale-95 lg:hidden cursor-pointer shrink-0"
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
        className={`fixed inset-x-0 top-4 sm:top-[8%] mx-auto w-[92vw] sm:w-[88vw] max-w-lg max-h-[85vh] rounded-3xl border border-border bg-surface-solid/98 backdrop-blur-2xl p-0 text-ink shadow-2xl overflow-hidden backdrop:bg-black/60 backdrop:backdrop-blur-sm ${
          isClosing ? "is-closing" : ""
        }`}
      >
        <div className="flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-surface-solid/80 px-4 py-3 sm:px-5 shrink-0">
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
              aria-label={t("nav.close_menu")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-ink-muted transition-colors hover:border-accent hover:text-ink active:scale-90 cursor-pointer"
            >
              ✕
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
                  const label = NAV_KEY_MAP[link.href] ? t(NAV_KEY_MAP[link.href]) : link.label;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                        active
                          ? "bg-accent/15 border-accent/40 text-accent font-bold"
                          : "border-border/70 bg-surface/70 text-ink-muted hover:border-accent/60 hover:bg-surface hover:text-ink"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">{link.icon}</span>
                        <span className="text-ink font-semibold truncate">{label}</span>
                      </div>
                      {link.badge ? (
                        <span className="rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[10px] font-bold text-accent shrink-0">
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
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 border border-border/70 bg-surface/70 text-ink-muted hover:border-accent/60 hover:bg-surface hover:text-ink sm:col-span-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🎲</span>
                    <span className="text-ink font-semibold">{t("nav.random_anime")}</span>
                  </div>
                  <span className="font-mono text-xs text-accent font-bold">↵</span>
                </a>
              </nav>
            </div>

            {/* App Install Banner */}
            <PwaInstallButton />
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-border bg-surface-solid px-4 py-2 text-[11px] text-ink-muted font-mono">
            <span>Kokunime Navigation</span>
            <span>Esc</span>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MobileMenu;
