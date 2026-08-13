"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

// Scroll position handling for client-side navigation.
//
// Next's App Router does NOT reset scroll on push navigation (the new page
// keeps the old scrollY — verified: home at 1800 → detail opens at 1784).
// A single scrollTo in useLayoutEffect is NOT enough either: it runs before
// the browser's own scroll restoration of the new entry, which then wins
// (verified: lands at 77 instead of 0). The rAF double-scroll runs after
// paint + restoration, so it sticks.
//
// Back/forward are intentionally left alone: the browser restores the
// previous position (bf-cache) — forcing 0 would destroy that UX.
//
// Module-level, NOT useRef: MainLayout renders per page, so this component
// remounts on every navigation and a ref would reset — the previous entry
// index would be lost and back-navigation would wrongly scroll to 0.
let lastIndex: number | null = null;

const ScrollToTop = () => {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const nav = (window as Window & { navigation?: { currentEntry?: { index?: number } } }).navigation;
    const index = nav?.currentEntry?.index;
    if (index !== undefined) {
      if (lastIndex !== null && index < lastIndex) {
        lastIndex = index;
        return; // back/forward — let the browser restore the position
      }
      lastIndex = index;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
