"use client";

import SettingsSectionHeader from "@/components/settings/settings-section-header";
import { StorageBreakdown } from "@/utils/settings";
import { useTranslation } from "@/utils/i18n";
import { ChangeEvent, JSX } from "react";

interface SettingsStorageSectionProps {
  storage: StorageBreakdown;
  mounted: boolean;
  quotaLabel: string | null;
  persisted: boolean | null;
  exportCopied: boolean;
  importStatus: string | null;
  onRequestPersist: () => void;
  onExportJson: () => void;
  onImportJson: (e: ChangeEvent<HTMLInputElement>) => void;
  onClearSearches: () => void;
  onClearHistory: () => void;
  onResetAll: () => void;
}

const SettingsStorageSection = ({
  storage,
  mounted,
  quotaLabel,
  persisted,
  exportCopied,
  importStatus,
  onRequestPersist,
  onExportJson,
  onImportJson,
  onClearSearches,
  onClearHistory,
  onResetAll,
}: SettingsStorageSectionProps): JSX.Element => {
  const { t, language } = useTranslation();

  return (
    <div className="card-shell">
      <div className="card-core p-5 sm:p-6 space-y-5">
        <SettingsSectionHeader
          icon="💾"
          iconClassName="bg-nb-purple"
          title={t("settings.storage_title")}
          desc={t("settings.storage_desc")}
        />

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

          <div className="flex items-center justify-between border-t border-border/60 pt-2 font-mono text-[10px]">
            <span className="text-ink-muted">{t("settings.quota_label")}</span>
            <span className="font-bold text-ink">{mounted && quotaLabel ? quotaLabel : "—"}</span>
          </div>

          <button
            type="button"
            onClick={onRequestPersist}
            disabled={persisted === true}
            className="w-full rounded-sm border-2 border-border bg-surface px-3 py-2 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:bg-nb-teal active:translate-y-0 active:shadow-none cursor-pointer disabled:cursor-default disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {persisted === true ? t("settings.persist_active") : t("settings.persist_button")}
          </button>
        </div>

        {/* Backup & Restore Tools */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onExportJson}
            className="w-full flex items-center justify-center gap-2 rounded-sm border-2 border-border bg-accent px-4 py-2.5 font-mono text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
          >
            <span>📥 {t("settings.download_json")}</span>
          </button>

          <label className="w-full flex items-center justify-center gap-2 rounded-sm border-2 border-border bg-surface px-4 py-2.5 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:bg-nb-purple hover:text-nb-ink active:translate-y-0 active:shadow-none cursor-pointer">
            <span>📤 {t("settings.restore_json")}</span>
            <input type="file" accept=".json" onChange={onImportJson} className="hidden" />
          </label>

          {exportCopied && (
            <p className="text-center font-mono text-xs font-bold text-ink animate-fade-in pt-1">
              {language === "en" ? "✓ Backup file downloaded successfully." : "✓ File backup berhasil diunduh."}
            </p>
          )}
          {importStatus && (
            <p className="text-center font-mono text-xs font-bold text-ink animate-fade-in pt-1">{importStatus}</p>
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
              onClick={onClearSearches}
              className="rounded-sm border-2 border-border bg-surface px-3 py-2 font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:bg-nb-red hover:text-nb-ink transition-all cursor-pointer"
            >
              {t("settings.clear_searches")}
            </button>
            <button
              type="button"
              onClick={onClearHistory}
              className="rounded-sm border-2 border-border bg-surface px-3 py-2 font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:bg-nb-red hover:text-nb-ink transition-all cursor-pointer"
            >
              {t("settings.clear_history")}
            </button>
            <button
              type="button"
              onClick={onResetAll}
              className="col-span-2 rounded-sm border-2 border-border bg-surface px-3 py-2 font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:bg-nb-red hover:text-nb-ink transition-all cursor-pointer"
            >
              {t("settings.reset_all")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsStorageSection;
