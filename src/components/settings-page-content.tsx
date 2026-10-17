"use client";

import {
  ACCENT_PRESETS,
  AppSettings,
  AccentColor,
  AppLanguage,
  CardDensity,
  FontFamily,
  FontSize,
  ReadingMode,
  calculateStorageBreakdown,
  exportAllAppData,
  getStoredSettings,
  importAllAppData,
  saveSettings,
  DEFAULT_SETTINGS,
  SETTINGS_CHANGE_EVENT,
  StorageBreakdown,
} from "@/utils/settings";
import { STORAGE_KEYS } from "@/utils/storage-keys";
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
        setImportStatus(
          language === "en" ? "✓ Data & preferences restored successfully!" : "✓ Data & preferensi berhasil diimpor!",
        );
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
      localStorage.removeItem(STORAGE_KEYS.recentSearches);
      setStorage(calculateStorageBreakdown());
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleClearHistory = () => {
    const msg = language === "en" ? "Clear all watched anime history?" : "Hapus semua riwayat tontonan anime?";
    if (confirm(msg)) {
      localStorage.removeItem(STORAGE_KEYS.watchHistory);
      setStorage(calculateStorageBreakdown());
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleResetSettings = () => {
    const msg =
      language === "en"
        ? "Reset all settings to default values?"
        : "Kembalikan semua pengaturan ke nilai bawaan (default)?";
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
                <span className="h-2 w-2 rounded-sm bg-accent animate-pulse" />
                {t("settings.hub")}
              </span>
              <span className="rounded-sm bg-surface-muted px-3 py-0.5 font-mono text-xs font-bold text-ink-muted">
                Kokunime {t("common.pro")} v1.0
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-ink">
              {t("settings.title")}
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">{t("settings.subtitle")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-accent px-4 py-2 font-mono text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <span>📥 {t("settings.export_backup")}</span>
            </button>
            <button
              type="button"
              onClick={handleResetSettings}
              title={t("settings.reset_default")}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-surface px-4 py-2 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:bg-nb-red hover:text-nb-ink active:translate-y-0 active:shadow-none cursor-pointer"
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
              <div className="flex items-center justify-between gap-2 border-b-2 border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-ink">
                    {t("settings.live_preview")}
                  </span>
                </div>
                <span className="rounded-sm border-2 border-border bg-surface-muted px-3 py-1 font-mono text-xs font-bold text-ink-muted">
                  {language === "en"
                    ? `Accent: ${mounted ? (currentAccent?.label ?? "Sunset Orange") : "Sunset Orange"}`
                    : `Aksen: ${mounted ? (currentAccent?.label ?? "Sunset Orange") : "Sunset Orange"}`}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 bg-surface-solid rounded-sm p-4 sm:p-5 border-2 border-border">
                <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-sm bg-surface-muted border-2 border-border shadow-[2px_2px_0_0_var(--border)]">
                  <div className="absolute inset-0 flex flex-col justify-between p-2">
                    <span className="self-end rounded-sm border-2 border-border bg-nb-lime px-1.5 py-0.2 font-mono text-[8px] font-bold text-nb-ink">
                      {t("common.ongoing")}
                    </span>
                    <div className="space-y-0.5 rounded-sm bg-nb-ink/70 p-1">
                      <span className="block font-mono text-[9px] font-bold text-nb-cream truncate">
                        {t("common.episode")} 12
                      </span>
                      <span className="block font-mono text-[8px] text-nb-yellow">★ 8.95</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-2.5 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="rounded-sm border-2 border-border bg-nb-yellow px-2.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink">
                      Action
                    </span>
                    <span className="rounded-sm border-2 border-border bg-surface-muted px-2.5 py-0.5 font-mono text-[10px] text-ink-muted">
                      Fantasy
                    </span>
                    <span className="rounded-sm border-2 border-border bg-surface-muted px-2.5 py-0.5 font-mono text-[10px] text-ink-muted">
                      Adventure
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-ink transition-colors">
                    {language === "en" ? "Kokunime Anime Title Preview" : "Pratinjau Judul Anime Kokunime"}
                  </h3>

                  <p className="line-clamp-2 text-xs text-ink-muted leading-relaxed">{t("settings.preview_desc")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 0: Bahasa Aplikasi (App Language) */}
          <div className="card-shell">
            <div className="card-core p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2.5 border-b-2 border-border pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-border bg-nb-yellow text-nb-ink text-base">
                  🌐
                </span>
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
                    className={`flex items-start gap-3.5 p-4 rounded-sm border-2 text-left transition-all duration-150 cursor-pointer ${
                      mounted && (settings.language === l.key || language === l.key)
                        ? "border-accent bg-accent/15"
                        : "border-border bg-surface-solid hover:bg-surface"
                    }`}
                  >
                    <span className="text-3xl shrink-0 mt-0.5">{l.flag}</span>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-xs sm:text-sm font-bold text-ink">{l.title}</span>
                        {mounted && (settings.language === l.key || language === l.key) && (
                          <span className="rounded-sm border-2 border-border bg-nb-lime px-2 py-0.2 font-mono text-[9px] font-bold text-nb-ink">
                            ✓ Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink-muted leading-tight">{l.desc}</p>
                      <span className="inline-block rounded-sm border border-border bg-surface-muted px-2 py-0.5 font-mono text-[9px] text-ink-muted">
                        {l.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 1: Tampilan & Warna Aksen */}
          <div className="card-shell">
            <div className="card-core p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2.5 border-b-2 border-border pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-border bg-nb-pink text-nb-ink text-base">
                  🎨
                </span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{t("settings.theme_title")}</h2>
                  <p className="text-xs text-ink-muted">{t("settings.theme_desc")}</p>
                </div>
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
                      className={`flex flex-col items-center p-3.5 rounded-sm border-2 transition-all cursor-pointer ${
                        mounted && settings.accent === p.key
                          ? "border-accent bg-accent/15 shadow-[2px_2px_0_0_var(--border)]"
                          : "border-border bg-surface hover:bg-surface-muted"
                      }`}
                    >
                      <span
                        className="h-7 w-7 rounded-sm border-2 border-border shadow-[2px_2px_0_0_var(--border)]"
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
                <label className="flex items-center justify-between p-3.5 rounded-sm border-2 border-border bg-surface-solid hover:bg-surface transition-colors cursor-pointer">
                  <div>
                    <span className="font-display text-xs font-bold text-ink block">
                      🌙 {t("settings.night_shift")}
                    </span>
                    <span className="text-[10px] text-ink-muted">{t("settings.night_shift_desc")}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mounted ? settings.nightShift : false}
                    onChange={(e) => updateSetting("nightShift", e.target.checked)}
                    className="h-4 w-4 rounded-sm border-border accent-accent cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-sm border-2 border-border bg-surface-solid hover:bg-surface transition-colors cursor-pointer">
                  <div>
                    <span className="font-display text-xs font-bold text-ink block">
                      ⚡ {t("settings.reduce_motion")}
                    </span>
                    <span className="text-[10px] text-ink-muted">{t("settings.reduce_motion_desc")}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mounted ? settings.reduceMotion : false}
                    onChange={(e) => updateSetting("reduceMotion", e.target.checked)}
                    className="h-4 w-4 rounded-sm border-border accent-accent cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Tipografi & Mode Baca */}
          <div className="card-shell">
            <div className="card-core p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2.5 border-b-2 border-border pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-border bg-nb-teal text-nb-ink text-base">
                  🔤
                </span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{t("settings.typography_title")}</h2>
                  <p className="text-xs text-ink-muted">{t("settings.typography_desc")}</p>
                </div>
              </div>

              {/* Font Family Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    key: "mono",
                    name: "Cyber Monospace",
                    preview: "123456 • JetBrains Mono",
                    desc: "Tajam & Khas Cyberpunk",
                  },
                  { key: "sans", name: "Modern Sans", preview: "Plus Jakarta Sans", desc: "Bersih, Rapi & Halus" },
                  {
                    key: "serif",
                    name: "Editorial Serif",
                    preview: "Literata Editorial",
                    desc: "Klasik & Nyaman Membaca",
                  },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => updateSetting("font", f.key as FontFamily)}
                    className={`flex flex-col p-4 rounded-sm border-2 text-left transition-all cursor-pointer ${
                      mounted && settings.font === f.key
                        ? "border-accent bg-accent/15"
                        : "border-border bg-surface-solid"
                    }`}
                  >
                    <span className="font-bold text-xs text-ink">{f.name}</span>
                    <span className="mt-1 font-mono text-[11px] text-accent font-semibold">{f.preview}</span>
                    <span className="mt-1 text-[10px] text-ink-muted">{f.desc}</span>
                  </button>
                ))}
              </div>

              {/* Font Scale & Reading Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-sm border-2 border-border bg-surface-solid space-y-2">
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
                        className={`flex-1 rounded-sm py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                          mounted && settings.fontSize === s.key
                            ? "border-2 border-border bg-accent text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                            : "border-border bg-surface text-ink-muted hover:text-ink"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-sm border-2 border-border bg-surface-solid space-y-2">
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
                        className={`flex-1 rounded-sm py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                          mounted && settings.readingMode === m.key
                            ? "border-2 border-border bg-accent text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                            : "border-border bg-surface text-ink-muted hover:text-ink"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-sm border-2 border-border bg-surface-solid space-y-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {t("settings.density")}
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { key: "comfortable", label: t("settings.density_comfort") },
                      { key: "compact", label: t("settings.density_compact") },
                    ].map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => updateSetting("density", d.key as CardDensity)}
                        className={`flex-1 rounded-sm py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                          mounted && settings.density === d.key
                            ? "border-2 border-border bg-accent text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                            : "border-border bg-surface text-ink-muted hover:text-ink"
                        }`}
                      >
                        {d.label}
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
              <div className="flex items-center gap-2.5 border-b-2 border-border pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-border bg-nb-orange text-nb-ink text-base">
                  🧭
                </span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{t("settings.catalog_pref")}</h2>
                  <p className="text-xs text-ink-muted">{t("settings.catalog_desc")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {/* 1. Default Catalog View */}
                <div className="p-4 rounded-sm border-2 border-border bg-surface-solid flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-display text-xs sm:text-sm font-bold text-ink block">
                      {t("settings.default_view")}
                    </span>
                    <span className="text-[11px] text-ink-muted leading-relaxed">
                      {language === "en"
                        ? "Default display mode when browsing catalog"
                        : "Mode tampilan default saat menjelajah katalog"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateSetting("defaultView", "grid")}
                      className={`flex-1 rounded-sm py-2 font-mono text-xs font-bold cursor-pointer transition-all ${
                        mounted && settings.defaultView === "grid"
                          ? "border-2 border-border bg-accent text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                          : "border-border bg-surface text-ink-muted hover:text-ink"
                      }`}
                    >
                      ⊞ Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting("defaultView", "list")}
                      className={`flex-1 rounded-sm py-2 font-mono text-xs font-bold cursor-pointer transition-all ${
                        mounted && settings.defaultView === "list"
                          ? "border-2 border-border bg-accent text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                          : "border-border bg-surface text-ink-muted hover:text-ink"
                      }`}
                    >
                      ☰ List
                    </button>
                  </div>
                </div>

                {/* 2. Download Layout */}
                <div className="p-4 rounded-sm border-2 border-border bg-surface-solid flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-display text-xs sm:text-sm font-bold text-ink block">
                      {t("settings.download_layout")}
                    </span>
                    <span className="text-[11px] text-ink-muted leading-relaxed">
                      {t("settings.download_layout_desc")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateSetting("downloadLayout", "cards")}
                      className={`flex-1 rounded-sm py-2 font-mono text-xs font-bold cursor-pointer transition-all ${
                        mounted && (settings.downloadLayout || "cards") === "cards"
                          ? "border-2 border-border bg-accent text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                          : "border-border bg-surface text-ink-muted hover:text-ink"
                      }`}
                    >
                      {t("settings.layout_cards")}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting("downloadLayout", "matrix")}
                      className={`flex-1 rounded-sm py-2 font-mono text-xs font-bold cursor-pointer transition-all ${
                        mounted && settings.downloadLayout === "matrix"
                          ? "border-2 border-border bg-accent text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                          : "border-border bg-surface text-ink-muted hover:text-ink"
                      }`}
                    >
                      {t("settings.layout_matrix")}
                    </button>
                  </div>
                </div>

                {/* 3. Data Saver */}
                <label className="flex items-center justify-between p-4 rounded-sm border-2 border-border bg-surface-solid hover:border-accent/50 transition-colors cursor-pointer">
                  <div>
                    <span className="font-display text-xs sm:text-sm font-bold text-ink block">
                      📉 {t("settings.data_saver")}
                    </span>
                    <span className="text-[11px] text-ink-muted">{t("settings.data_saver_desc")}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mounted ? settings.dataSaver : false}
                    onChange={(e) => updateSetting("dataSaver", e.target.checked)}
                    className="h-4 w-4 rounded-sm border-border accent-accent cursor-pointer ml-3"
                  />
                </label>

                {/* 4. Hide Spoilers */}
                <label className="flex items-center justify-between p-4 rounded-sm border-2 border-border bg-surface-solid hover:border-accent/50 transition-colors cursor-pointer">
                  <div>
                    <span className="font-display text-xs sm:text-sm font-bold text-ink block">
                      🛡️ {t("settings.hide_spoilers")}
                    </span>
                    <span className="text-[11px] text-ink-muted">{t("settings.hide_spoilers_desc")}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mounted ? settings.hideSpoilers : false}
                    onChange={(e) => updateSetting("hideSpoilers", e.target.checked)}
                    className="h-4 w-4 rounded-sm border-border accent-accent cursor-pointer ml-3"
                  />
                </label>

                {/* 5. Auto-mark watched */}
                <label className="flex items-center justify-between p-4 rounded-sm border-2 border-border bg-surface-solid hover:border-accent/50 transition-colors cursor-pointer">
                  <div>
                    <span className="font-display text-xs sm:text-sm font-bold text-ink block">
                      ✅ {t("settings.auto_mark")}
                    </span>
                    <span className="text-[11px] text-ink-muted">{t("settings.auto_mark_desc")}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mounted ? settings.autoMarkWatched : false}
                    onChange={(e) => updateSetting("autoMarkWatched", e.target.checked)}
                    className="h-4 w-4 rounded-sm border-border accent-accent cursor-pointer ml-3"
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
              <div className="flex items-center gap-2.5 border-b-2 border-border pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-border bg-nb-purple text-nb-ink text-base">
                  💾
                </span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{t("settings.storage_title")}</h2>
                  <p className="text-xs text-ink-muted">{t("settings.storage_desc")}</p>
                </div>
              </div>

              {/* Storage Meter */}
              <div className="p-4 rounded-sm bg-surface-solid border-2 border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink">{t("settings.total_storage")}</span>
                  <span className="rounded-sm border border-border bg-nb-teal px-2.5 py-0.5 font-mono text-xs font-bold text-nb-ink">
                    {mounted ? storage.formattedTotal : "0 KB"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-2.5 rounded-sm bg-surface border-2 border-border">
                    <span className="text-[10px] text-ink-muted block">🔖 {t("settings.bookmarks")}</span>
                    <span className="font-bold text-ink">{mounted ? storage.bookmarksCount : 0} Anime</span>
                  </div>
                  <div className="p-2.5 rounded-sm bg-surface border-2 border-border">
                    <span className="text-[10px] text-ink-muted block">🕒 {t("settings.history")}</span>
                    <span className="font-bold text-ink">{mounted ? storage.historyCount : 0} Anime</span>
                  </div>
                  <div className="p-2.5 rounded-sm bg-surface border-2 border-border">
                    <span className="text-[10px] text-ink-muted block">🔍 {t("settings.search_history")}</span>
                    <span className="font-bold text-ink">
                      {mounted ? storage.searchHistoryCount : 0} {language === "en" ? "Words" : "Kata"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-sm bg-surface border-2 border-border">
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
                  className="w-full flex items-center justify-center gap-2 rounded-sm border-2 border-border bg-accent px-4 py-2.5 font-mono text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  <span>📥 {t("settings.download_json")}</span>
                </button>

                <label className="w-full flex items-center justify-center gap-2 rounded-sm border-2 border-border bg-surface px-4 py-2.5 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:bg-nb-purple hover:text-nb-ink active:translate-y-0 active:shadow-none cursor-pointer">
                  <span>📤 {t("settings.restore_json")}</span>
                  <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                </label>

                {exportCopied && (
                  <p className="text-center font-mono text-xs font-bold text-ink animate-fade-in pt-1">
                    {language === "en" ? "✓ Backup file downloaded successfully." : "✓ File backup berhasil diunduh."}
                  </p>
                )}
                {importStatus && (
                  <p className="text-center font-mono text-xs font-bold text-ink animate-fade-in pt-1">
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
                    className="rounded-sm border-2 border-border bg-surface px-3 py-2 font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:bg-nb-red hover:text-nb-ink transition-all cursor-pointer"
                  >
                    {t("settings.clear_searches")}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="rounded-sm border-2 border-border bg-surface px-3 py-2 font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:bg-nb-red hover:text-nb-ink transition-all cursor-pointer"
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
              <div className="flex items-center gap-2.5 border-b-2 border-border pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-border bg-nb-lime text-nb-ink text-base">
                  ℹ️
                </span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{t("settings.system_info")}</h2>
                  <p className="text-xs text-ink-muted">{t("settings.system_desc")}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-sm bg-surface border-2 border-border">
                  <span className="text-ink-muted">{t("settings.framework")}</span>
                  <span className="font-bold text-ink">Next.js 16 (Turbopack)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-sm bg-surface border-2 border-border">
                  <span className="text-ink-muted">{t("settings.render_engine")}</span>
                  <span className="font-bold text-ink">React 19 Server Components</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-sm bg-surface border-2 border-border">
                  <span className="text-ink-muted">{t("settings.offline_app")}</span>
                  <span className="rounded-sm border border-border bg-nb-lime px-1.5 font-bold text-nb-ink">
                    {t("settings.pwa_ready")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                <Link
                  href="/api"
                  className="flex items-center justify-center rounded-sm border-2 border-border bg-surface px-3 py-2 text-center font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:text-ink transition-all"
                >
                  REST API ↗
                </Link>
                <a
                  href="https://github.com/kochan4php/kokunime"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center rounded-sm border-2 border-border bg-surface-muted px-3 py-2 text-center font-semibold text-ink hover:bg-nb-yellow transition-colors"
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
