"use client";

import SettingsSectionHeader from "@/components/settings/settings-section-header";
import { AppSettings, CardDensity, FontFamily, FontSize, ReadingMode } from "@/utils/settings";
import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

interface SettingsTypographySectionProps {
  settings: AppSettings;
  mounted: boolean;
  onUpdate: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const activeSegmentClass = "border-2 border-border bg-accent text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]";
const idleSegmentClass = "border-border bg-surface text-ink-muted hover:text-ink";

const SettingsTypographySection = ({ settings, mounted, onUpdate }: SettingsTypographySectionProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="card-shell">
      <div className="card-core p-5 sm:p-6 space-y-5">
        <SettingsSectionHeader
          icon="🔤"
          iconClassName="bg-nb-teal"
          title={t("settings.typography_title")}
          desc={t("settings.typography_desc")}
        />

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
              onClick={() => onUpdate("font", f.key as FontFamily)}
              className={`flex flex-col p-4 rounded-sm border-2 text-left transition-all cursor-pointer ${
                mounted && settings.font === f.key ? "border-accent bg-accent/15" : "border-border bg-surface-solid"
              }`}
            >
              <span className="font-bold text-xs text-ink">{f.name}</span>
              <span className="mt-1 font-mono text-[11px] text-accent-text font-semibold">{f.preview}</span>
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
                  onClick={() => onUpdate("fontSize", s.key as FontSize)}
                  className={`flex-1 rounded-sm py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                    mounted && settings.fontSize === s.key ? activeSegmentClass : idleSegmentClass
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
                  onClick={() => onUpdate("readingMode", m.key as ReadingMode)}
                  className={`flex-1 rounded-sm py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                    mounted && settings.readingMode === m.key ? activeSegmentClass : idleSegmentClass
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
                  onClick={() => onUpdate("density", d.key as CardDensity)}
                  className={`flex-1 rounded-sm py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                    mounted && settings.density === d.key ? activeSegmentClass : idleSegmentClass
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
  );
};

export default SettingsTypographySection;
