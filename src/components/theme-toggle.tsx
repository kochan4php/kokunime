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
      emit();
    };

    if ((document as any).startViewTransition) {
      (document as any).startViewTransition(applyTheme);
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
