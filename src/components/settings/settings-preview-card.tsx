"use client";

import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

interface SettingsPreviewCardProps {
  accentName: string;
}

// Live preview of how cards look with the current accent.
const SettingsPreviewCard = ({ accentName }: SettingsPreviewCardProps): JSX.Element => {
  const { t, language } = useTranslation();

  return (
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
            {language === "en" ? `Accent: ${accentName}` : `Aksen: ${accentName}`}
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
  );
};

export default SettingsPreviewCard;
