"use client";

import { JSX, useEffect, useState } from "react";

const ACCENT_STORAGE_KEY = "kokunime_accent";

export type AccentPreset = "orange" | "emerald" | "violet" | "cyan" | "rose";

const PRESETS: { key: AccentPreset; label: string; color: string }[] = [
  { key: "orange", label: "Sunset Orange", color: "#ff6a33" },
  { key: "emerald", label: "Emerald Green", color: "#10b981" },
  { key: "violet", label: "Mystic Violet", color: "#8b5cf6" },
  { key: "cyan", label: "Cyber Cyan", color: "#06b6d4" },
  { key: "rose", label: "Neon Rose", color: "#f43f5e" },
];

const CONTRAST_STORAGE_KEY = "kokunime_contrast";
const FONT_STORAGE_KEY = "kokunime_font";
const NIGHT_SHIFT_STORAGE_KEY = "kokunime_night_shift";

export type FontPreset = "sans" | "mono" | "serif";

export const AccentThemePicker = (): JSX.Element => {
  const [current, setCurrent] = useState<AccentPreset>(() => {
    if (typeof window === "undefined") return "orange";
    try {
      const saved = localStorage.getItem(ACCENT_STORAGE_KEY) as AccentPreset;
      return saved && PRESETS.some((p) => p.key === saved) ? saved : "orange";
    } catch {
      return "orange";
    }
  });

  const [isOled, setIsOled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(CONTRAST_STORAGE_KEY) === "oled";
    } catch {
      return false;
    }
  });

  const [font, setFont] = useState<FontPreset>(() => {
    if (typeof window === "undefined") return "mono";
    try {
      const saved = localStorage.getItem(FONT_STORAGE_KEY) as FontPreset;
      return saved && ["sans", "mono", "serif"].includes(saved) ? saved : "mono";
    } catch {
      return "mono";
    }
  });

  const [nightShift, setNightShift] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(NIGHT_SHIFT_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (current && current !== "orange") {
      document.documentElement.setAttribute("data-accent", current);
    }
    if (isOled) {
      document.documentElement.setAttribute("data-contrast", "oled");
    }
    if (font && font !== "mono") {
      document.documentElement.setAttribute("data-font", font);
    }
    if (nightShift) {
      document.documentElement.setAttribute("data-night-shift", "true");
    }
  }, [current, isOled, font, nightShift]);

  const selectAccent = (preset: AccentPreset) => {
    setCurrent(preset);
    if (preset === "orange") {
      document.documentElement.removeAttribute("data-accent");
      localStorage.removeItem(ACCENT_STORAGE_KEY);
    } else {
      document.documentElement.setAttribute("data-accent", preset);
      localStorage.setItem(ACCENT_STORAGE_KEY, preset);
    }
  };

  const selectFont = (f: FontPreset) => {
    setFont(f);
    if (f === "mono") {
      document.documentElement.removeAttribute("data-font");
      localStorage.removeItem(FONT_STORAGE_KEY);
    } else {
      document.documentElement.setAttribute("data-font", f);
      localStorage.setItem(FONT_STORAGE_KEY, f);
    }
  };

  const toggleNightShift = () => {
    const next = !nightShift;
    setNightShift(next);
    if (next) {
      document.documentElement.setAttribute("data-night-shift", "true");
      localStorage.setItem(NIGHT_SHIFT_STORAGE_KEY, "true");
    } else {
      document.documentElement.removeAttribute("data-night-shift");
      localStorage.removeItem(NIGHT_SHIFT_STORAGE_KEY);
    }
  };

  const toggleOled = () => {
    const next = !isOled;
    setIsOled(next);
    if (next) {
      document.documentElement.setAttribute("data-contrast", "oled");
      localStorage.setItem(CONTRAST_STORAGE_KEY, "oled");
    } else {
      document.documentElement.removeAttribute("data-contrast");
      localStorage.removeItem(CONTRAST_STORAGE_KEY);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface p-1">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => selectAccent(p.key)}
            title={`Pilih tema warna ${p.label}`}
            aria-label={`Tema warna ${p.label}`}
            className={`h-4 w-4 rounded-full transition-transform cursor-pointer ${
              current === p.key
                ? "scale-125 ring-2 ring-ink ring-offset-1 ring-offset-bg"
                : "opacity-70 hover:opacity-100 hover:scale-110"
            }`}
            style={{ backgroundColor: p.color }}
          />
        ))}
      </div>

      <div className="flex items-center rounded-full border border-border bg-surface p-0.5 font-mono text-[10px]">
        {(["sans", "mono", "serif"] as FontPreset[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => selectFont(f)}
            title={`Pilih jenis font ${f.toUpperCase()}`}
            className={`rounded-full px-2 py-0.5 uppercase transition-colors cursor-pointer ${
              font === f ? "bg-accent text-(--accent-ink) font-bold" : "text-ink-muted hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={toggleNightShift}
        title={nightShift ? "Matikan mode Night Shift" : "Aktifkan mode Night Shift (Peredup mata malam hari)"}
        aria-label="Toggle Night Shift"
        className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
          nightShift
            ? "border border-amber-500 bg-amber-500/20 text-amber-500"
            : "border border-border bg-surface text-ink-muted hover:border-accent hover:text-ink"
        }`}
      >
        🌙
      </button>

      <button
        type="button"
        onClick={toggleOled}
        title={isOled ? "Kembali ke tema normal" : "Aktifkan mode AMOLED Black murni"}
        aria-label="Toggle AMOLED Black"
        className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
          isOled
            ? "border border-accent bg-accent text-(--accent-ink)"
            : "border border-border bg-surface text-ink-muted hover:border-accent hover:text-ink"
        }`}
      >
        OLED
      </button>
    </div>
  );
};
