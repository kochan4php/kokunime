"use client";

import MobileMenuPanel from "./mobile-menu-panel";
import { JSX, useEffect, useRef } from "react";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActive: (href: string) => boolean;
}

// Mobile-only hamburger button + slide-down menu. Owns the open-state side
// effects (focus, Escape, tap-outside, body scroll lock); the header needs
// `open` for its background styling, so state lives in the parent.
const MobileMenu = ({ open, onOpenChange, isActive }: MobileMenuProps): JSX.Element => {
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  // Focus management: move focus into the menu when it opens, restore it to
  // the toggle when it closes (a11y basics).
  useEffect(() => {
    if (open) {
      menuRef.current?.querySelector<HTMLElement>("nav a")?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
      wasOpen.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    // Tap/click anywhere outside the header closes the menu. Without this the
    // mobile menu stays open after tapping the page behind it (verified bug),
    // and tapping a content link navigates with the menu still open.
    const onPointerDown = (e: PointerEvent) => {
      const header = toggleRef.current?.closest("header");
      if (!header?.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onOpenChange]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => onOpenChange(!open)}
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

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        aria-hidden={!open}
        className={`absolute inset-x-0 top-full border-b border-border bg-bg/95 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-4 opacity-0"
        }`}
      >
        <MobileMenuPanel onClose={() => onOpenChange(false)} isActive={isActive} />
      </div>
    </>
  );
};

export default MobileMenu;
