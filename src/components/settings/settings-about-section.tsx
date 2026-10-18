"use client";

import SettingsSectionHeader from "@/components/settings/settings-section-header";
import { useTranslation } from "@/utils/i18n";
import { showToast } from "@/utils/toast";
import Link from "next/link";
import { JSX, useState } from "react";

const SettingsAboutSection = (): JSX.Element => {
  const { t } = useTranslation();
  const [checking, setChecking] = useState(false);
  const buildId = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev";

  // Honest update check: ask the browser to re-fetch /sw.js. When a new worker
  // installs, sw-register already offers "Muat ulang" — this button only makes
  // the wait explicit instead of silent.
  const checkForUpdate = async (): Promise<void> => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      showToast(t("settings.update_unavailable"));
      return;
    }
    setChecking(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        showToast(t("settings.update_unavailable"));
        return;
      }
      await registration.update();
      showToast(t("settings.update_checked"));
    } catch {
      showToast(t("settings.update_unavailable"));
    } finally {
      setChecking(false);
    }
  };

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
          <div className="flex items-center justify-between gap-3 p-2 rounded-sm bg-surface border-2 border-border">
            <span className="shrink-0 text-ink-muted">{t("settings.app_version")}</span>
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate font-bold text-ink">{buildId}</span>
              <button
                type="button"
                onClick={() => void checkForUpdate()}
                disabled={checking}
                className="shrink-0 rounded-sm border-2 border-border bg-surface-muted px-2 py-0.5 font-bold text-ink transition-colors hover:bg-nb-lime hover:text-nb-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t("settings.check_update")}
              </button>
            </span>
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
