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
    const root = document.documentElement;
    root.classList.add("theme-transition");
    window.requestAnimationFrame(() => {
      root.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      emit();
    });
    window.setTimeout(() => root.classList.remove("theme-transition"), 350);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Gunakan mode terang" : "Gunakan mode gelap"}
      className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-all duration-300 hover:text-accent"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default ThemeToggle;
