"use client";

import SettingsAboutSection from "@/components/settings/settings-about-section";
import SettingsAppearanceSection from "@/components/settings/settings-appearance-section";
import SettingsCatalogSection from "@/components/settings/settings-catalog-section";
import SettingsLanguageSection from "@/components/settings/settings-language-section";
import SettingsPreviewCard from "@/components/settings/settings-preview-card";
import SectionHeader from "@/components/section-header";
import SettingsStorageSection from "@/components/settings/settings-storage-section";
import SettingsTypographySection from "@/components/settings/settings-typography-section";
import {
  ACCENT_PRESETS,
  AppLanguage,
  AppSettings,
  calculateStorageBreakdown,
  DEFAULT_SETTINGS,
  exportAllAppData,
  getStoredSettings,
  importAllAppData,
  saveSettings,
  SETTINGS_CHANGE_EVENT,
  StorageBreakdown,
} from "@/utils/settings";
import { STORAGE_KEYS } from "@/utils/storage-keys";
import { useTranslation } from "@/utils/i18n";
import { JSX, useEffect, useState } from "react";

const DEFAULT_STORAGE: StorageBreakdown = {
  bookmarksCount: 0,
  bookmarksBytes: 0,
  historyCount: 0,
  historyBytes: 0,
  searchHistoryCount: 0,
  searchHistoryBytes: 0,
  queueCount: 0,
  queueBytes: 0,
  marksCount: 0,
  marksBytes: 0,
  settingsBytes: 0,
  totalBytes: 0,
  formattedTotal: "0 KB",
};

// Human-readable bytes for the storage quota line (Intl has no byte unit).
const formatQuota = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** exponent).toFixed(1)} ${units[exponent]}`;
};

const SettingsPageContent = (): JSX.Element => {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [storage, setStorage] = useState<StorageBreakdown>(DEFAULT_STORAGE);
  const [exportCopied, setExportCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [quotaLabel, setQuotaLabel] = useState<string | null>(null);

  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    setMounted(true);
    setSettings(getStoredSettings());
    setStorage(calculateStorageBreakdown());

    // PWA storage manager: show the browser quota and whether persistence was
    // already granted (installed PWAs usually get it automatically).
    void (async () => {
      try {
        const estimate = await navigator.storage?.estimate?.();
        if (estimate?.quota) {
          setQuotaLabel(`${formatQuota(estimate.usage ?? 0)} / ${formatQuota(estimate.quota)}`);
        }
        setPersisted((await navigator.storage?.persisted?.()) ?? false);
      } catch {
        // Storage API unavailable (private mode) — leave both unset.
      }
    })();

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

  const handleRequestPersist = async (): Promise<void> => {
    try {
      const granted = await navigator.storage?.persist?.();
      setPersisted(granted ?? false);
    } catch {
      setPersisted(false);
    }
  };

  const handleResetAll = (): void => {
    const msg =
      language === "en"
        ? "Erase ALL local Kokunime data (bookmarks, history, settings)? This cannot be undone."
        : "Hapus SEMUA data lokal Kokunime (bookmark, riwayat, pengaturan)? Tindakan ini tidak bisa dibatalkan.";
    if (!confirm(msg)) return;
    for (const key of Object.values(STORAGE_KEYS)) {
      try {
        localStorage.removeItem(key);
      } catch {
        // Storage blocked — nothing to clear there.
      }
    }
    if ("caches" in window) {
      void caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
    }
    window.location.reload();
  };

  const currentAccent = ACCENT_PRESETS.find((p) => p.key === settings.accent) || ACCENT_PRESETS[0];
  const accentName = mounted ? (currentAccent?.label ?? "Sunset Orange") : "Sunset Orange";

  return (
    <div className="w-full space-y-8">
      <SectionHeader
        kicker={t("settings.hub")}
        title={t("settings.title")}
        titleAs="h1"
        tone="purple"
        badge={
          <span className="rounded-sm border-2 border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink-muted shadow-[2px_2px_0_0_var(--border)]">
            Kokunime {t("common.pro")} v1.0
          </span>
        }
        description={t("settings.subtitle")}
        aside={
          <>
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-accent px-4 py-2 font-mono text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <span>📥 {t("settings.export_backup")}</span>
            </button>
            <button
              type="button"
              onClick={handleResetSettings}
              title={t("settings.reset_default")}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-surface px-4 py-2 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:bg-nb-red hover:text-nb-ink active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <span>🔄 {t("settings.reset_default")}</span>
            </button>
          </>
        }
      />

      {/* Main Full-Width Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Primary Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <SettingsPreviewCard accentName={accentName} />
          <SettingsLanguageSection
            settings={settings}
            mounted={mounted}
            onLanguageChange={(lang) => updateSetting("language", lang)}
          />
          <SettingsAppearanceSection settings={settings} mounted={mounted} onUpdate={updateSetting} />
          <SettingsTypographySection settings={settings} mounted={mounted} onUpdate={updateSetting} />
          <SettingsCatalogSection settings={settings} mounted={mounted} onUpdate={updateSetting} />
        </div>

        {/* Right / Sidebar Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <SettingsStorageSection
            storage={storage}
            mounted={mounted}
            quotaLabel={quotaLabel}
            persisted={persisted}
            exportCopied={exportCopied}
            importStatus={importStatus}
            onRequestPersist={() => void handleRequestPersist()}
            onExportJson={handleExportJson}
            onImportJson={handleImportJson}
            onClearSearches={handleClearSearches}
            onClearHistory={handleClearHistory}
            onResetAll={handleResetAll}
          />
          <SettingsAboutSection />
        </div>
      </div>
    </div>
  );
};

export default SettingsPageContent;
