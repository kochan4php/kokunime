"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { JSX, useEffect, useSyncExternalStore } from "react";

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

// Track the applied theme SYNCHRONOUSLY. startViewTransition defers its
// callback to the next frame, so reading the DOM class during a rapid second
// click still sees the OLD theme — two quick clicks would toggle once and the
// second toggle would be silently dropped. This mirror flips instantly.
let appliedDark: boolean | null = null;

const ThemeToggle = (): JSX.Element => {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        const isDark = e.newValue === "dark";
        document.documentElement.classList.toggle("dark", isDark);
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#201613" : "#fdf5eb");
        appliedDark = isDark;
        emit();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = (): void => {
    if (appliedDark === null) appliedDark = getSnapshot();
    appliedDark = !appliedDark;
    const next = appliedDark;
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
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished?: Promise<unknown>; ready?: Promise<unknown> };
    };
    if (doc.startViewTransition) {
      try {
        // A rapid second click skips the running transition: its `finished`
        // promise rejects with AbortError ("Transition was skipped"). Swallow
        // it and re-apply — applyTheme is idempotent (toggle-with-force), so
        // calling it again is safe and the theme never silently drops.
        const vt = doc.startViewTransition(applyTheme);
        // A skipped transition rejects BOTH `finished` and `ready` with
        // AbortError — swallow both so rapid re-clicks never surface a
        // pageerror; re-apply is idempotent anyway.
        vt.finished?.catch?.(() => applyTheme());
        vt.ready?.catch?.(() => {});
      } catch {
        applyTheme();
      }
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
