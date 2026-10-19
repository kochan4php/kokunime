"use client";

import {
  type BackupImportMode,
  type BackupPreview,
  exportAllAppData,
  importAllAppData,
  isBackupError,
  previewBackupText,
} from "@/utils/backup";
import { decryptBackup, encryptBackup } from "@/utils/backup-crypto";
import { type AppLanguage, type AppSettings, getStoredSettings } from "@/utils/settings";
import { type ChangeEvent, useState } from "react";

interface UseBackupToolsOptions {
  language: AppLanguage;
  onRestored: (settings: AppSettings) => void;
}

interface UseBackupToolsResult {
  exportCopied: boolean;
  importStatus: string | null;
  preview: BackupPreview | null;
  passphrase: string;
  busy: boolean;
  setPassphrase: (value: string) => void;
  exportJson: () => void;
  exportEncrypted: () => Promise<void>;
  saveToFolder: () => Promise<void>;
  importJson: (event: ChangeEvent<HTMLInputElement>) => void;
  importFile: (file: File) => Promise<void>;
  apply: (mode: BackupImportMode) => Promise<void>;
  cancelPreview: () => void;
}

// Backup UI state machine: preview → checksum/decrypt → transactional import.
// Kept out of the settings page so the page stays layout-only.
export const useBackupTools = ({ language, onRestored }: UseBackupToolsOptions): UseBackupToolsResult => {
  const [exportCopied, setExportCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [busy, setBusy] = useState(false);
  const en = language === "en";

  const downloadText = (text: string, filename: string): void => {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = (): void => {
    downloadText(exportAllAppData(), `kokunime-backup-${new Date().toISOString().slice(0, 10)}.json`);
    setExportCopied(true);
    window.setTimeout(() => setExportCopied(false), 3000);
  };

  const exportEncrypted = async (): Promise<void> => {
    if (passphrase.trim().length < 8) {
      setImportStatus(en ? "⚠️ Passphrase must be at least 8 characters." : "⚠️ Kata sandi minimal 8 karakter.");
      return;
    }
    setBusy(true);
    try {
      const encrypted = await encryptBackup(exportAllAppData(), passphrase);
      downloadText(encrypted, `kokunime-backup-${new Date().toISOString().slice(0, 10)}.enc.json`);
      setImportStatus(
        en
          ? "✓ Encrypted backup downloaded. Keep the passphrase safe."
          : "✓ Backup terenkripsi diunduh. Simpan kata sandinya.",
      );
    } catch {
      setImportStatus(en ? "⚠️ Encryption failed." : "⚠️ Enkripsi gagal.");
    } finally {
      setBusy(false);
    }
  };

  const saveToFolder = async (): Promise<void> => {
    const picker = (
      window as unknown as {
        showSaveFilePicker?: (options?: {
          suggestedName?: string;
          types?: { description: string; accept: Record<string, string[]> }[];
        }) => Promise<{
          createWritable: () => Promise<{ write: (data: string) => Promise<void>; close: () => Promise<void> }>;
        }>;
      }
    ).showSaveFilePicker;
    if (!picker) {
      exportJson();
      return;
    }
    try {
      const handle = await picker({
        suggestedName: `kokunime-backup-${new Date().toISOString().slice(0, 10)}.json`,
        types: [{ description: "JSON backup", accept: { "application/json": [".json"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(exportAllAppData());
      await writable.close();
      setExportCopied(true);
      window.setTimeout(() => setExportCopied(false), 3000);
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") {
        setImportStatus(en ? "⚠️ Could not save the file." : "⚠️ Gagal menyimpan berkas.");
      }
    }
  };

  const importFile = async (file: File): Promise<void> => {
    try {
      const text = await file.text();
      const result = previewBackupText(text);
      if (isBackupError(result)) {
        setPreview(null);
        setImportStatus(`⚠️ ${result.error}`);
        return;
      }
      setPreview(result);
      setImportStatus(null);
    } catch {
      setPreview(null);
      setImportStatus(en ? "⚠️ Could not read the file." : "⚠️ Gagal membaca berkas.");
    }
  };

  const apply = async (mode: BackupImportMode): Promise<void> => {
    if (!preview) return;
    setBusy(true);
    try {
      let text = preview.text;
      if (preview.encrypted) {
        if (!passphrase) {
          setImportStatus(en ? "⚠️ Enter the backup passphrase." : "⚠️ Masukkan kata sandi backup.");
          return;
        }
        try {
          text = await decryptBackup(text, passphrase);
        } catch {
          setImportStatus(en ? "⚠️ Wrong passphrase." : "⚠️ Kata sandi salah.");
          return;
        }
      }
      if (!importAllAppData(text, mode)) {
        setImportStatus(
          en ? "⚠️ Invalid backup or checksum mismatch." : "⚠️ Backup tidak valid atau checksum tidak cocok.",
        );
        return;
      }
      onRestored(getStoredSettings());
      setPreview(null);
      setPassphrase("");
      setImportStatus(
        mode === "merge"
          ? en
            ? "✓ Backup merged into the current data."
            : "✓ Backup digabung dengan data sekarang."
          : en
            ? "✓ Backup restored and replaced the current data."
            : "✓ Backup dipulihkan dan menggantikan data sekarang.",
      );
      window.setTimeout(() => setImportStatus(null), 5000);
    } finally {
      setBusy(false);
    }
  };

  const importJson = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) void importFile(file);
    event.target.value = "";
  };

  const cancelPreview = (): void => {
    setPreview(null);
    setPassphrase("");
  };

  return {
    exportCopied,
    importStatus,
    preview,
    passphrase,
    busy,
    setPassphrase,
    exportJson,
    exportEncrypted,
    saveToFolder,
    importJson,
    importFile,
    apply,
    cancelPreview,
  };
};
