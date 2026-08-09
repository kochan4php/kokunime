"use client";

import { JSX, useSyncExternalStore } from "react";

const SunIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[18px] w-[18px]"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[18px] w-[18px]"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

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
