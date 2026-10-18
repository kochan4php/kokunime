"use client";

import SettingsSectionHeader from "@/components/settings/settings-section-header";
import { useTranslation } from "@/utils/i18n";
import Link from "next/link";
import { JSX } from "react";

const SettingsAboutSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="card-shell">
      <div className="card-core p-5 sm:p-6 space-y-4">
        <SettingsSectionHeader
          icon="ℹ️"
          iconClassName="bg-nb-lime"
          title={t("settings.system_info")}
          desc={t("settings.system_desc")}
        />

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
            className="flex items-center justify-center rounded-sm border-2 border-border bg-surface px-3 py-2 text-center font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] motion-safe:hover:-translate-y-0.5 hover:text-ink transition-all"
          >
            REST API ↗
          </Link>
          <a
            href="https://github.com/kochan4php/kokunime"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center rounded-sm border-2 border-border bg-surface-muted px-3 py-2 text-center font-semibold text-ink hover:bg-nb-yellow hover:text-nb-ink transition-colors"
          >
            GitHub Repo ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsAboutSection;
