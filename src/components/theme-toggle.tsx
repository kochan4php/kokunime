"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { JSX, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): boolean => document.documentElement.classList.contains("dark");

const getServerSnapshot = (): boolean => false;

const emit = (): void => {
  listeners.forEach((listener) => listener());
};

const ThemeToggle = (): JSX.Element => {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = (): void => {
    const next = !getSnapshot();
    const applyTheme = () => {
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      // Keep browser chrome in sync with the applied theme (hexes mirror the
      // theme script in layout.tsx).
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next ? "#201613" : "#fdf5eb");
      emit();
    };

    // Must be called as a MEMBER of document — a detached reference
    // (`const vt = document.startViewTransition; vt(cb)`) loses `this` and
    // throws "Illegal invocation", silently breaking the toggle in every
    // Chromium browser. Verified live via puppeteer click.
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition) {
      doc.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Gunakan mode terang" : "Gunakan mode gelap"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-accent/50 text-accent transition-all duration-300 hover:border-accent hover:bg-accent/10"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default ThemeToggle;
