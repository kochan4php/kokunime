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

export const AccentThemePicker = (): JSX.Element => {
  const [current, setCurrent] = useState<AccentPreset>("orange");
  const [isOled, setIsOled] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem(ACCENT_STORAGE_KEY) as AccentPreset;
    if (saved && PRESETS.some((p) => p.key === saved)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrent(saved);
      if (saved === "orange") {
        document.documentElement.removeAttribute("data-accent");
      } else {
        document.documentElement.setAttribute("data-accent", saved);
      }
    }

    const savedContrast = localStorage.getItem(CONTRAST_STORAGE_KEY);
    if (savedContrast === "oled") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOled(true);
      document.documentElement.setAttribute("data-contrast", "oled");
    }
  }, []);

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
    <div className="flex items-center gap-2">
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
