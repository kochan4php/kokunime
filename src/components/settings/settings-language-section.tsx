"use client";

import SettingsSectionHeader from "@/components/settings/settings-section-header";
import { AppLanguage, AppSettings } from "@/utils/settings";
import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

interface SettingsLanguageSectionProps {
  settings: AppSettings;
  mounted: boolean;
  onLanguageChange: (language: AppLanguage) => void;
}

const SettingsLanguageSection = ({
  settings,
  mounted,
  onLanguageChange,
}: SettingsLanguageSectionProps): JSX.Element => {
  const { t, language } = useTranslation();

  return (
    <div className="card-shell">
      <div className="card-core p-5 sm:p-6 space-y-5">
        <SettingsSectionHeader
          icon="🌐"
          iconClassName="bg-nb-yellow"
          title={t("settings.language_title")}
          desc={t("settings.language_desc")}
        />

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
              onClick={() => onLanguageChange(l.key)}
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
  );
};

export default SettingsLanguageSection;
