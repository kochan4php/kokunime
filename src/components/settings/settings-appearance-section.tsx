"use client";

import SettingsSectionHeader from "@/components/settings/settings-section-header";
import { ACCENT_PRESETS, AppSettings, ThemeMode } from "@/utils/settings";
import { TranslationKey, useTranslation } from "@/utils/i18n";
import { JSX } from "react";

interface SettingsAppearanceSectionProps {
  settings: AppSettings;
  mounted: boolean;
  onUpdate: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onReset: () => void;
}

const THEME_OPTIONS: { key: ThemeMode; icon: string; labelKey: TranslationKey }[] = [
  { key: "light", icon: "☀️", labelKey: "settings.theme_light" },
  { key: "dark", icon: "🌙", labelKey: "settings.theme_dark" },
  { key: "system", icon: "🖥️", labelKey: "settings.theme_system" },
];

const SettingsAppearanceSection = ({
  settings,
  mounted,
  onUpdate,
  onReset,
}: SettingsAppearanceSectionProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="card-shell">
      <div className="card-core p-5 sm:p-6 space-y-5">
        <SettingsSectionHeader
          icon="🎨"
          iconClassName="bg-nb-pink"
          title={t("settings.theme_title")}
          desc={t("settings.theme_desc")}
          onReset={onReset}
        />

        {/* Theme mode: explicit light/dark, or follow the device */}
        <div className="space-y-3 pt-2">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ink-muted">
            {t("settings.theme_mode")}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map((option) => {
              const active = mounted && settings.theme === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onUpdate("theme", option.key)}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-sm border-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "border-accent bg-accent/15 text-ink shadow-[2px_2px_0_0_var(--border)]"
                      : "border-border bg-surface text-ink-muted hover:bg-surface-muted hover:text-ink"
                  }`}
                >
                  <span aria-hidden>{option.icon}</span>
                  {t(option.labelKey)}
                </button>
              );
            })}
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
                onClick={() => onUpdate("accent", p.key)}
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
              <span className="font-display text-xs font-bold text-ink block">🌙 {t("settings.night_shift")}</span>
              <span className="text-[10px] text-ink-muted">{t("settings.night_shift_desc")}</span>
            </div>
            <input
              type="checkbox"
              checked={mounted ? settings.nightShift : false}
              onChange={(e) => onUpdate("nightShift", e.target.checked)}
              className="h-6 w-6 shrink-0 rounded-sm border-border accent-accent cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-sm border-2 border-border bg-surface-solid hover:bg-surface transition-colors cursor-pointer">
            <div>
              <span className="font-display text-xs font-bold text-ink block">⚡ {t("settings.reduce_motion")}</span>
              <span className="text-[10px] text-ink-muted">{t("settings.reduce_motion_desc")}</span>
            </div>
            <input
              type="checkbox"
              checked={mounted ? settings.reduceMotion : false}
              onChange={(e) => onUpdate("reduceMotion", e.target.checked)}
              className="h-6 w-6 shrink-0 rounded-sm border-border accent-accent cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsAppearanceSection;
