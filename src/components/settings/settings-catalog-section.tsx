"use client";

import SettingsSectionHeader from "@/components/settings/settings-section-header";
import { AppSettings } from "@/utils/settings";
import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

interface SettingsCatalogSectionProps {
  settings: AppSettings;
  mounted: boolean;
  onUpdate: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onReset: () => void;
}

const SettingsCatalogSection = ({ settings, mounted, onUpdate, onReset }: SettingsCatalogSectionProps): JSX.Element => {
  const { t, language } = useTranslation();

  return (
    <div className="card-shell">
      <div className="card-core p-5 sm:p-6 space-y-5">
        <SettingsSectionHeader
          icon="🧭"
          iconClassName="bg-nb-orange"
          title={t("settings.catalog_pref")}
          desc={t("settings.catalog_desc")}
          onReset={onReset}
        />

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
                onClick={() => onUpdate("defaultView", "grid")}
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
                onClick={() => onUpdate("defaultView", "list")}
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
              <span className="text-[11px] text-ink-muted leading-relaxed">{t("settings.download_layout_desc")}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdate("downloadLayout", "cards")}
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
                onClick={() => onUpdate("downloadLayout", "matrix")}
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
              onChange={(e) => onUpdate("dataSaver", e.target.checked)}
              className="h-6 w-6 shrink-0 rounded-sm border-border accent-accent cursor-pointer ml-3"
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
              onChange={(e) => onUpdate("hideSpoilers", e.target.checked)}
              className="h-6 w-6 shrink-0 rounded-sm border-border accent-accent cursor-pointer ml-3"
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
              onChange={(e) => onUpdate("autoMarkWatched", e.target.checked)}
              className="h-6 w-6 shrink-0 rounded-sm border-border accent-accent cursor-pointer ml-3"
            />
          </label>

          {/* 6. Auto-archive completed bookmarks */}
          <label className="flex items-center justify-between p-4 rounded-sm border-2 border-border bg-surface-solid hover:border-accent/50 transition-colors cursor-pointer">
            <div>
              <span className="font-display text-xs sm:text-sm font-bold text-ink block">
                🗃️ {t("settings.auto_archive")}
              </span>
              <span className="text-[11px] text-ink-muted">{t("settings.auto_archive_desc")}</span>
            </div>
            <input
              type="checkbox"
              checked={mounted ? settings.autoArchive : false}
              onChange={(e) => onUpdate("autoArchive", e.target.checked)}
              className="h-6 w-6 shrink-0 rounded-sm border-border accent-accent cursor-pointer ml-3"
            />
          </label>

          {/* 7. Weekly episode goal */}
          <div className="p-4 rounded-sm border-2 border-border bg-surface-solid flex items-center justify-between gap-3">
            <div>
              <span className="font-display text-xs sm:text-sm font-bold text-ink block">
                🎯 {t("settings.weekly_goal")}
              </span>
              <span className="text-[11px] text-ink-muted">{t("settings.weekly_goal_desc")}</span>
            </div>
            <input
              type="number"
              min={0}
              max={99}
              value={mounted ? settings.weeklyGoal : 0}
              onChange={(e) => {
                const value = Math.max(0, Math.min(99, Math.floor(Number(e.target.value) || 0)));
                onUpdate("weeklyGoal", value);
              }}
              aria-label={t("settings.weekly_goal")}
              className="h-9 w-16 shrink-0 rounded-sm border-2 border-border bg-surface px-2 text-center font-mono text-xs font-bold text-ink outline-none transition-all focus:border-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsCatalogSection;
