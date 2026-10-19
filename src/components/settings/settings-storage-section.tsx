"use client";

import SettingsSectionHeader from "@/components/settings/settings-section-header";
import { BackupCollection, BackupImportMode, BackupPreview } from "@/utils/backup";
import { StorageBreakdown } from "@/utils/settings";
import { useTranslation } from "@/utils/i18n";
import { ChangeEvent, DragEvent, JSX, useState } from "react";

interface SettingsStorageSectionProps {
  storage: StorageBreakdown;
  mounted: boolean;
  quotaLabel: string | null;
  persisted: boolean | null;
  exportCopied: boolean;
  importStatus: string | null;
  preview: BackupPreview | null;
  backupBusy: boolean;
  passphrase: string;
  onPassphraseChange: (value: string) => void;
  onRequestPersist: () => void;
  onExportJson: () => void;
  onExportEncrypted: () => void;
  onSavePicker: () => void;
  onImportJson: (e: ChangeEvent<HTMLInputElement>) => void;
  onImportFile: (file: File) => void;
  onApplyBackup: (mode: BackupImportMode) => void;
  onCancelPreview: () => void;
  onClearSearches: () => void;
  onClearHistory: () => void;
  onResetAll: () => void;
}

const COLLECTION_LABELS: Record<BackupCollection, { id: string; en: string }> = {
  bookmarks: { id: "Tersimpan", en: "Bookmarks" },
  history: { id: "Riwayat", en: "History" },
  searches: { id: "Pencarian", en: "Searches" },
  queue: { id: "Antrean", en: "Queue" },
  progress: { id: "Progres", en: "Progress" },
  episodeLog: { id: "Tanda episode", en: "Episode marks" },
  collections: { id: "Koleksi", en: "Collections" },
  savedSearches: { id: "Pencarian tersimpan", en: "Saved searches" },
};

const SettingsStorageSection = ({
  storage,
  mounted,
  quotaLabel,
  persisted,
  exportCopied,
  importStatus,
  preview,
  backupBusy,
  passphrase,
  onPassphraseChange,
  onRequestPersist,
  onExportJson,
  onExportEncrypted,
  onSavePicker,
  onImportJson,
  onImportFile,
  onApplyBackup,
  onCancelPreview,
  onClearSearches,
  onClearHistory,
  onResetAll,
}: SettingsStorageSectionProps): JSX.Element => {
  const { t, language } = useTranslation();
  const [dragging, setDragging] = useState(false);
  const en = language === "en";

  const handleDrop = (event: DragEvent<HTMLLabelElement>): void => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onImportFile(file);
  };

  const collectionLabel = (key: BackupCollection): string => COLLECTION_LABELS[key][en ? "en" : "id"];
  const previewRows = preview?.rows.filter((row) => row.incoming > 0) ?? [];

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
                {mounted ? storage.searchHistoryCount : 0} {en ? "Words" : "Kata"}
              </span>
            </div>
            <div className="p-2.5 rounded-sm bg-surface border-2 border-border">
              <span className="text-[10px] text-ink-muted block">📋 {t("settings.queue")}</span>
              <span className="font-bold text-ink">{mounted ? storage.queueCount : 0} Anime</span>
            </div>
            <div className="p-2.5 rounded-sm bg-surface border-2 border-border">
              <span className="text-[10px] text-ink-muted block">📈 {t("settings.episode_log")}</span>
              <span className="font-bold text-ink">
                {mounted ? storage.marksCount : 0} {en ? "Marks" : "Tanda"}
              </span>
            </div>
            <div className="p-2.5 rounded-sm bg-surface border-2 border-border">
              <span className="text-[10px] text-ink-muted block">⚙️ {t("settings.saved_settings")}</span>
              <span className="font-bold text-ink">{en ? "Saved" : "Tersimpan"}</span>
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
            className="w-full rounded-sm border-2 border-border bg-surface px-3 py-2 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:bg-nb-teal hover:text-nb-ink active:translate-y-0 active:shadow-none cursor-pointer disabled:cursor-default disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {persisted === true ? t("settings.persist_active") : t("settings.persist_button")}
          </button>
        </div>

        {/* Backup & Restore Tools */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onExportJson}
            className="w-full flex items-center justify-center gap-2 rounded-sm border-2 border-border bg-accent px-4 py-2.5 font-mono text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
          >
            <span>📥 {t("settings.download_json")}</span>
          </button>

          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`w-full flex items-center justify-center gap-2 rounded-sm border-2 px-4 py-2.5 font-mono text-xs font-bold shadow-[2px_2px_0_0_var(--border)] transition-all focus-within:ring-2 focus-within:ring-accent motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer ${
              dragging
                ? "border-accent bg-nb-yellow text-nb-ink"
                : "border-border bg-surface text-ink hover:bg-nb-purple hover:text-nb-ink"
            }`}
          >
            <span>📤 {t("settings.restore_json")}</span>
            <input type="file" accept=".json,application/json" onChange={onImportJson} className="sr-only" />
          </label>
          <p className="text-center font-mono text-[10px] text-ink-muted">
            {en ? "or drop a backup file above" : "atau jatuhkan berkas backup di atas"}
          </p>

          <label className="block font-mono text-[10px] uppercase tracking-wider text-ink-muted pt-1">
            {en ? "Backup passphrase (optional)" : "Kata sandi backup (opsional)"}
            <input
              type="password"
              autoComplete="new-password"
              value={passphrase}
              onChange={(event) => onPassphraseChange(event.target.value)}
              placeholder={en ? "min. 8 characters" : "min. 8 karakter"}
              className="mt-1 w-full rounded-sm border-2 border-border bg-surface px-3 py-2 font-mono text-xs font-normal normal-case tracking-normal text-ink placeholder:text-ink-muted"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onExportEncrypted}
              disabled={backupBusy}
              className="rounded-sm border-2 border-border bg-surface px-2 py-2 font-mono text-[11px] font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all hover:bg-nb-purple hover:text-nb-ink cursor-pointer disabled:cursor-wait disabled:opacity-60"
            >
              🔐 {en ? "Encrypted" : "Terenkripsi"}
            </button>
            <button
              type="button"
              onClick={onSavePicker}
              className="rounded-sm border-2 border-border bg-surface px-2 py-2 font-mono text-[11px] font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all hover:bg-nb-teal hover:text-nb-ink cursor-pointer"
            >
              🗂️ {en ? "Save to folder" : "Simpan ke folder"}
            </button>
          </div>

          {preview && (
            <div className="rounded-sm border-2 border-border bg-surface-solid p-3 space-y-2 animate-fade-in">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                {preview.encrypted
                  ? `🔐 ${en ? "Encrypted backup" : "Backup terenkripsi"} · ${en ? "enter the passphrase above" : "isi kata sandi di atas"}`
                  : `📦 Backup v${preview.version} · checksum ${preview.checksum}`}
              </p>
              {!preview.encrypted && (
                <ul className="space-y-0.5 font-mono text-[11px] text-ink">
                  {previewRows.length === 0 ? (
                    <li className="text-ink-muted">
                      {en
                        ? "Nothing to add — merge is a no-op."
                        : "Tidak ada data baru — gabung tidak mengubah apa pun."}
                    </li>
                  ) : (
                    previewRows.map((row) => (
                      <li key={row.key} className="flex items-center justify-between gap-2">
                        <span>{collectionLabel(row.key)}</span>
                        <span className="text-ink-muted">
                          {row.incoming} → +{row.added}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              )}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onApplyBackup("merge")}
                  disabled={backupBusy}
                  className="rounded-sm border-2 border-border bg-nb-lime px-2 py-2 font-mono text-[11px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] cursor-pointer disabled:cursor-wait disabled:opacity-60"
                >
                  {en ? "Merge" : "Gabung"}
                </button>
                <button
                  type="button"
                  onClick={() => onApplyBackup("replace")}
                  disabled={backupBusy}
                  className="rounded-sm border-2 border-border bg-nb-red px-2 py-2 font-mono text-[11px] font-bold text-nb-cream shadow-[2px_2px_0_0_var(--border)] cursor-pointer disabled:cursor-wait disabled:opacity-60"
                >
                  {en ? "Replace" : "Ganti"}
                </button>
              </div>
              <button
                type="button"
                onClick={onCancelPreview}
                className="w-full rounded-sm border border-border bg-surface px-2 py-1.5 font-mono text-[10px] text-ink-muted hover:text-ink cursor-pointer"
              >
                {en ? "Cancel" : "Batal"}
              </button>
            </div>
          )}

          <div role="status" aria-live="polite">
            {exportCopied && (
              <p className="text-center font-mono text-xs font-bold text-ink animate-fade-in pt-1">
                {en ? "✓ Backup file downloaded successfully." : "✓ File backup berhasil diunduh."}
              </p>
            )}
            {importStatus && (
              <p className="text-center font-mono text-xs font-bold text-ink animate-fade-in pt-1">{importStatus}</p>
            )}
          </div>
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
