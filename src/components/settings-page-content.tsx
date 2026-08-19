"use client";

import {
  ACCENT_PRESETS,
  AppSettings,
  AccentColor,
  AppLanguage,
  FontFamily,
  FontSize,
  ReadingMode,
  ThemeMode,
  calculateStorageBreakdown,
  exportAllAppData,
  getStoredSettings,
  importAllAppData,
  saveSettings,
  DEFAULT_SETTINGS,
  SETTINGS_CHANGE_EVENT,
  StorageBreakdown,
} from "@/utils/settings";
import { useTranslation, TranslationKey } from "@/utils/i18n";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";

const DEFAULT_STORAGE: StorageBreakdown = {
  bookmarksCount: 0,
  bookmarksBytes: 0,
  historyCount: 0,
  historyBytes: 0,
  searchHistoryCount: 0,
  searchHistoryBytes: 0,
  settingsBytes: 0,
  totalBytes: 0,
  formattedTotal: "0 KB",
};

const SettingsPageContent = (): JSX.Element => {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [storage, setStorage] = useState<StorageBreakdown>(DEFAULT_STORAGE);
  const [exportCopied, setExportCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    setMounted(true);
    setSettings(getStoredSettings());
    setStorage(calculateStorageBreakdown());

    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<AppSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        setSettings(getStoredSettings());
      }
      setStorage(calculateStorageBreakdown());
    };

    window.addEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChange);
    window.addEventListener("storage", handleSettingsChange);

    return () => {
      window.removeEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChange);
      window.removeEventListener("storage", handleSettingsChange);
    };
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettings(updated);
    if (key === "language") {
      setLanguage(value as AppLanguage);
    }
  };

  const handleExportJson = () => {
    const json = exportAllAppData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kokunime-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 3000);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllAppData(content);
      if (success) {
        setImportStatus(language === "en" ? "✓ Data & preferences restored successfully!" : "✓ Data & preferensi berhasil diimpor!");
        setSettings(getStoredSettings());
        setStorage(calculateStorageBreakdown());
      } else {
        setImportStatus(language === "en" ? "⚠️ Invalid JSON backup format." : "⚠️ Format file JSON tidak valid.");
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClearSearches = () => {
    const msg = language === "en" ? "Clear all recent search history?" : "Hapus semua riwayat pencarian terakhir?";
    if (confirm(msg)) {
      localStorage.removeItem("kokunime_search_history");
      setStorage(calculateStorageBreakdown());
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleClearHistory = () => {
    const msg = language === "en" ? "Clear all watched anime history?" : "Hapus semua riwayat tontonan anime?";
    if (confirm(msg)) {
      localStorage.removeItem("kokunime_watch_history");
      setStorage(calculateStorageBreakdown());
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleResetSettings = () => {
    const msg = language === "en" ? "Reset all settings to default values?" : "Kembalikan semua pengaturan ke nilai bawaan (default)?";
    if (confirm(msg)) {
      saveSettings(DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
      setLanguage("id");
    }
  };

  const currentAccent = ACCENT_PRESETS.find((p) => p.key === settings.accent) || ACCENT_PRESETS[0];

  return (
    <div className="w-full space-y-8">
      {/* Full-Width Header Banner */}
      <div className="card-shell overflow-hidden">
        <div className="card-core p-5 sm:p-7 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                {t("settings.hub")}
              </span>
              <span className="rounded-full bg-surface-muted px-3 py-0.5 font-mono text-xs font-bold text-ink-muted">
                Kokunime {t("common.pro")} v1.0
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-ink">
              {t("settings.title")}
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              {t("settings.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-mono text-xs font-bold text-(--accent-ink) shadow-md transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <span>📥 {t("settings.export_backup")}</span>
            </button>
            <button
              type="button"
              onClick={handleResetSettings}
              title={t("settings.reset_default")}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 font-mono text-xs font-semibold text-ink-muted transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500 active:scale-95 cursor-pointer"
            >
              <span>🔄 {t("settings.reset_default")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Width Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Primary Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live Interactive Preview Card */}
          <div className="card-shell overflow-hidden">
            <div className="card-core p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-ink">
                    {t("settings.live_preview")}
                  </span>
                </div>
                <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-xs font-bold text-accent">
                  {language === "en" ? `Accent: ${mounted ? currentAccent.label : "Sunset Orange"}` : `Aksen: ${mounted ? currentAccent.label : "Sunset Orange"}`}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 bg-surface/60 rounded-2xl p-4 sm:p-5 border border-border/70">
                <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-muted border border-border shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-2">
                    <span className="self-end rounded-full bg-emerald-500 px-1.5 py-0.2 font-mono text-[8px] font-bold text-black">
                      {t("common.ongoing")}
                    </span>
                    <div className="space-y-0.5">
                      <span className="block font-mono text-[9px] font-bold text-white truncate">{t("common.episode")} 12</span>
                      <span className="block font-mono text-[8px] text-amber-300">★ 8.95</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-2.5 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="rounded-md bg-accent/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-accent">
                      Action
                    </span>
                    <span className="rounded-md bg-surface-muted px-2.5 py-0.5 font-mono text-[10px] text-ink-muted">
                      Fantasy
                    </span>
                    <span className="rounded-md bg-surface-muted px-2.5 py-0.5 font-mono text-[10px] text-ink-muted">
                      Adventure
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-ink transition-colors">
                    {language === "en" ? "Kokunime Anime Title Preview" : "Pratinjau Judul Anime Kokunime"}
                  </h3>

                  <p className="line-clamp-2 text-xs text-ink-muted leading-relaxed">
                    {t("settings.preview_desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 0: Bahasa Aplikasi (App Language) */}
          <div className="card-shell">
            <div className="card-core p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-border pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 text-base">🌐</span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{t("settings.language_title")}</h2>
                  <p className="text-xs text-ink-muted">{t("settings.language_desc")}</p>
                </div>
              </div>

              {/* Language Radio Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    key: "id" as AppLanguage,
                    flag: "🇮🇩",
                    title: t("settings.lang_id_title"),
                    desc: t("settings.lang_id_desc"),
                    badge: "Bawaan / Default",
                  },
                  {
                    key: "en" as AppLanguage,
                    flag: "🇬🇧",
                    title: t("settings.lang_en_title"),
                    desc: t("settings.lang_en_desc"),
                    badge: "International",
                  },
                ].map((l) => (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => updateSetting("language", l.key)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      mounted && (settings.language === l.key || language === l.key)
                        ? "border-accent bg-accent/10 scale-[1.01]"
                        : "border-border bg-surface-solid hover:border-accent/40 hover:bg-surface"
                    }`}
                  >
                    <span className="text-3xl shrink-0 mt-0.5">{l.flag}</span>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-xs sm:text-sm font-bold text-ink">{l.title}</span>
                        {mounted && (settings.language === l.key || language === l.key) && (
                          <span className="rounded-full bg-accent px-2 py-0.2 font-mono text-[9px] font-bold text-(--accent-ink)">
                            ✓ Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink-muted leading-tight">{l.desc}</p>
                      <span className="inline-block rounded-md bg-surface-muted px-2 py-0.5 font-mono text-[9px] text-ink-muted">
                        {l.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 1: Tema & Warna Antarmuka */}
          <div className="card-shell">
            <div className="card-core p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-border pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 text-base">🎨</span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{t("settings.theme_title")}</h2>
                  <p className="text-xs text-ink-muted">{t("settings.theme_desc")}</p>
                </div>
              </div>

              {/* Theme Mode Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: "system", title: t("settings.theme_system"), desc: t("settings.theme_system_desc"), icon: "💻" },
                  { key: "light", title: t("settings.theme_light"), desc: t("settings.theme_light_desc"), icon: "☀️" },
                  { key: "dark", title: t("settings.theme_dark"), desc: t("settings.theme_dark_desc"), icon: "🌙" },
                  { key: "oled", title: t("settings.theme_oled"), desc: t("settings.theme_oled_desc"), icon: "⬛" },
                ].map((tItem) => (
                  <button
                    key={tItem.key}
                    type="button"
                    onClick={() => updateSetting("theme", tItem.key as ThemeMode)}
                    className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      mounted && settings.theme === tItem.key
                        ? "border-accent bg-accent/10 scale-[1.02]"
                        : "border-border bg-surface-solid hover:border-accent/40 hover:bg-surface"
                    }`}
                  >
                    <span className="text-2xl">{tItem.icon}</span>
                    <span className="mt-2.5 font-display text-xs font-bold text-ink">{tItem.title}</span>
                    <span className="mt-0.5 text-[10px] text-ink-muted leading-tight">{tItem.desc}</span>
                  </button>
                ))}
              </div>

              {/* Accent Color Palette */}
              <div className="space-y-3 pt-2">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ink-muted">
                  {t("settings.accent_palette")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {ACCENT_PRESETS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => updateSetting("accent", p.key)}
                      className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        mounted && settings.accent === p.key
                          ? "border-accent bg-surface-muted shadow-md scale-[1.03]"
                          : "border-border bg-surface hover:border-accent/40 hover:bg-surface-muted/50"
                      }`}
                    >
                      <span
                        className="h-7 w-7 rounded-full shadow-md ring-2 ring-white/20"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="mt-2.5 font-mono text-xs font-bold text-ink">{p.label}</span>
                      <span className="mt-0.5 text-center text-[9px] text-ink-muted leading-tight">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Modifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-surface-solid hover:border-accent/50 transition-colors cursor-pointer">
                  <div>
                    <span className="font-display text-xs font-bold text-ink block">🌙 {t("settings.night_shift")}</span>
                    <span className="text-[10px] text-ink-muted">{t("settings.night_shift_desc")}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mounted ? settings.nightShift : false}
                    onChange={(e) => updateSetting("nightShift", e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-accent cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-surface-solid hover:border-accent/50 transition-colors cursor-pointer">
                  <div>
                    <span className="font-display text-xs font-bold text-ink block">✨ {t("settings.glassmorphism")}</span>
                    <span className="text-[10px] text-ink-muted">{t("settings.glassmorphism_desc")}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mounted ? settings.glassEffects : true}
                    onChange={(e) => updateSetting("glassEffects", e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-accent cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-surface-solid hover:border-accent/50 transition-colors cursor-pointer">
                  <div>
                    <span className="font-display text-xs font-bold text-ink block">⚡ {t("settings.reduce_motion")}</span>
                    <span className="text-[10px] text-ink-muted">{t("settings.reduce_motion_desc")}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mounted ? settings.reduceMotion : false}
                    onChange={(e) => updateSetting("reduceMotion", e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-accent cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Tipografi & Mode Baca */}
          <div className="card-shell">
            <div className="card-core p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-border pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 text-base">🔤</span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{t("settings.typography_title")}</h2>
                  <p className="text-xs text-ink-muted">{t("settings.typography_desc")}</p>
                </div>
              </div>

              {/* Font Family Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: "mono", name: "Cyber Monospace", preview: "123456 • JetBrains Mono", desc: "Tajam & Khas Cyberpunk" },
                  { key: "sans", name: "Modern Sans", preview: "Plus Jakarta Sans", desc: "Bersih, Rapi & Halus" },
                  { key: "serif", name: "Editorial Serif", preview: "Literata Editorial", desc: "Klasik & Nyaman Membaca" },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => updateSetting("font", f.key as FontFamily)}
                    className={`flex flex-col p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      mounted && settings.font === f.key
                        ? "border-accent bg-accent/10 shadow-sm scale-[1.01]"
                        : "border-border bg-surface-solid hover:border-accent/40"
                    }`}
                  >
                    <span className="font-bold text-xs text-ink">{f.name}</span>
                    <span className="mt-1 font-mono text-[11px] text-accent font-semibold">{f.preview}</span>
                    <span className="mt-1 text-[10px] text-ink-muted">{f.desc}</span>
                  </button>
                ))}
              </div>

              {/* Font Scale & Reading Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl border border-border bg-surface-solid space-y-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {t("settings.text_scale")}
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { key: "compact", label: t("settings.scale_compact") },
                      { key: "normal", label: t("settings.scale_normal") },
                      { key: "large", label: t("settings.scale_large") },
                    ].map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => updateSetting("fontSize", s.key as FontSize)}
                        className={`flex-1 rounded-xl py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                          mounted && settings.fontSize === s.key
                            ? "bg-accent text-(--accent-ink) shadow-xs"
                            : "border border-border bg-surface text-ink-muted hover:text-ink"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-border bg-surface-solid space-y-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {t("settings.reading_mode")}
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { key: "none", label: t("settings.reading_none") },
                      { key: "sepia", label: t("settings.reading_sepia") },
                      { key: "high-contrast", label: t("settings.reading_high_contrast") },
                    ].map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => updateSetting("readingMode", m.key as ReadingMode)}
                        className={`flex-1 rounded-xl py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                          mounted && settings.readingMode === m.key
                            ? "bg-accent text-(--accent-ink) shadow-xs"
                            : "border border-border bg-surface text-ink-muted hover:text-ink"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Preferensi Katalog & Konten */}
          <div className="card-shell">
            <div className="card-core p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-border pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 text-base">🧭</span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{t("settings.catalog_pref")}</h2>
                  <p className="text-xs text-ink-muted">{t("settings.catalog_desc")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {/* 1. Default Catalog View */}
                <div className="p-4 rounded-2xl border border-border bg-surface-solid flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-display text-xs sm:text-sm font-bold text-ink block">{t("settings.default_view")}</span>
                    <span className="text-[11px] text-ink-muted leading-relaxed">{language === "en" ? "Default display mode when browsing catalog" : "Mode tampilan default saat menjelajah katalog"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateSetting("defaultView", "grid")}
                      className={`flex-1 rounded-xl py-2 font-mono text-xs font-bold cursor-pointer transition-all ${
                        mounted && settings.defaultView === "grid"
                          ? "bg-accent text-(--accent-ink)"
                          : "border border-border bg-surface text-ink-muted hover:text-ink"
                      }`}
                    >
                      ⊞ Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting("defaultView", "list")}
                      className={`flex-1 rounded-xl py-2 font-mono text-xs font-bold cursor-pointer transition-all ${
                        mounted && settings.defaultView === "list"
                          ? "bg-accent text-(--accent-ink)"
                          : "border border-border bg-surface text-ink-muted hover:text-ink"
                      }`}
                    >
                      ☰ List
                    </button>
                  </div>
                </div>

                {/* 2. Download Layout */}
                <div className="p-4 rounded-2xl border border-border bg-surface-solid flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-display text-xs sm:text-sm font-bold text-ink block">{t("settings.download_layout")}</span>
                    <span className="text-[11px] text-ink-muted leading-relaxed">{t("settings.download_layout_desc")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateSetting("downloadLayout", "cards")}
                      className={`flex-1 rounded-xl py-2 font-mono text-xs font-bold cursor-pointer transition-all ${
                        mounted && (settings.downloadLayout || "cards") === "cards"
                          ? "bg-accent text-(--accent-ink)"
                          : "border border-border bg-surface text-ink-muted hover:text-ink"
                      }`}
                    >
                      {t("settings.layout_cards")}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting("downloadLayout", "matrix")}
                      className={`flex-1 rounded-xl py-2 font-mono text-xs font-bold cursor-pointer transition-all ${
                        mounted && settings.downloadLayout === "matrix"
                          ? "bg-accent text-(--accent-ink)"
                          : "border border-border bg-surface text-ink-muted hover:text-ink"
                      }`}
                    >
                      {t("settings.layout_matrix")}
                    </button>
                  </div>
                </div>

                {/* 3. Data Saver */}
                <label className="flex items-center justify-between p-4 rounded-2xl border border-border bg-surface-solid hover:border-accent/50 transition-colors cursor-pointer">
                  <div>
                    <span className="font-display text-xs sm:text-sm font-bold text-ink block">📉 {t("settings.data_saver")}</span>
                    <span className="text-[11px] text-ink-muted">{t("settings.data_saver_desc")}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mounted ? settings.dataSaver : false}
                    onChange={(e) => updateSetting("dataSaver", e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-accent cursor-pointer ml-3"
                  />
                </label>

                {/* 4. Hide Spoilers */}
                <label className="flex items-center justify-between p-4 rounded-2xl border border-border bg-surface-solid hover:border-accent/50 transition-colors cursor-pointer">
                  <div>
                    <span className="font-display text-xs sm:text-sm font-bold text-ink block">🛡️ {t("settings.hide_spoilers")}</span>
                    <span className="text-[11px] text-ink-muted">{t("settings.hide_spoilers_desc")}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mounted ? settings.hideSpoilers : false}
                    onChange={(e) => updateSetting("hideSpoilers", e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-accent cursor-pointer ml-3"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Sidebar Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section 4: Penyimpanan & Backup Data */}
          <div className="card-shell">
            <div className="card-core p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-border pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 text-base">💾</span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{t("settings.storage_title")}</h2>
                  <p className="text-xs text-ink-muted">{t("settings.storage_desc")}</p>
                </div>
              </div>

              {/* Storage Meter */}
              <div className="p-4 rounded-2xl bg-surface/60 border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink">{t("settings.total_storage")}</span>
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-mono text-xs font-bold text-accent">
                    {mounted ? storage.formattedTotal : "0 KB"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-surface border border-border">
                    <span className="text-[10px] text-ink-muted block">🔖 {t("settings.bookmarks")}</span>
                    <span className="font-bold text-ink">{mounted ? storage.bookmarksCount : 0} Anime</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface border border-border">
                    <span className="text-[10px] text-ink-muted block">🕒 {t("settings.history")}</span>
                    <span className="font-bold text-ink">{mounted ? storage.historyCount : 0} Anime</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface border border-border">
                    <span className="text-[10px] text-ink-muted block">🔍 {t("settings.search_history")}</span>
                    <span className="font-bold text-ink">{mounted ? storage.searchHistoryCount : 0} {language === "en" ? "Words" : "Kata"}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface border border-border">
                    <span className="text-[10px] text-ink-muted block">⚙️ {t("settings.saved_settings")}</span>
                    <span className="font-bold text-ink">{language === "en" ? "Saved" : "Tersimpan"}</span>
                  </div>
                </div>
              </div>

              {/* Backup & Restore Tools */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-mono text-xs font-bold text-(--accent-ink) shadow-md transition-transform hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  <span>📥 {t("settings.download_json")}</span>
                </button>

                <label className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 font-mono text-xs font-bold text-ink transition-all hover:border-accent hover:text-accent active:scale-95 cursor-pointer">
                  <span>📤 {t("settings.restore_json")}</span>
                  <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                </label>

                {exportCopied && (
                  <p className="text-center font-mono text-xs font-bold text-emerald-500 animate-fade-in pt-1">
                    {language === "en" ? "✓ Backup file downloaded successfully." : "✓ File backup berhasil diunduh."}
                  </p>
                )}
                {importStatus && (
                  <p className="text-center font-mono text-xs font-bold text-accent animate-fade-in pt-1">
                    {importStatus}
                  </p>
                )}
              </div>

              {/* Quick Clear Actions */}
              <div className="space-y-2 border-t border-border pt-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
                  {t("settings.data_cleaning")}
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <button
                    type="button"
                    onClick={handleClearSearches}
                    className="rounded-xl border border-border bg-surface px-3 py-2 font-semibold text-ink-muted hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer"
                  >
                    {t("settings.clear_searches")}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="rounded-xl border border-border bg-surface px-3 py-2 font-semibold text-ink-muted hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer"
                  >
                    {t("settings.clear_history")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Tentang Kokunime & Status Sistem */}
          <div className="card-shell">
            <div className="card-core p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-border pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 text-base">ℹ️</span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{t("settings.system_info")}</h2>
                  <p className="text-xs text-ink-muted">{t("settings.system_desc")}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border">
                  <span className="text-ink-muted">{t("settings.framework")}</span>
                  <span className="font-bold text-ink">Next.js 16 (Turbopack)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border">
                  <span className="text-ink-muted">{t("settings.render_engine")}</span>
                  <span className="font-bold text-ink">React 19 Server Components</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border">
                  <span className="text-ink-muted">{t("settings.offline_app")}</span>
                  <span className="font-bold text-emerald-500">{t("settings.pwa_ready")}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                <Link
                  href="/api"
                  className="flex items-center justify-center rounded-xl border border-border bg-surface px-3 py-2 text-center font-semibold text-ink-muted hover:border-accent hover:text-ink transition-colors"
                >
                  REST API ↗
                </Link>
                <a
                  href="https://github.com/kochan4php/kokunime"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center rounded-xl bg-surface-muted px-3 py-2 text-center font-semibold text-ink hover:text-accent transition-colors"
                >
                  GitHub Repo ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPageContent;
