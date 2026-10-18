"use client";

import {
  clearDiagnostics,
  type DiagnosticEntry,
  formatDiagnostics,
  getDiagnostics,
  subscribeDiagnostics,
} from "@/utils/diagnostics";
import { showToast } from "@/utils/toast";
import { JSX, useSyncExternalStore } from "react";

const TYPE_LABEL: Record<DiagnosticEntry["type"], string> = {
  error: "Galat",
  vital: "Vitals",
  sw: "Service worker",
  nav: "Navigasi",
  cache: "Cache",
};

const timeFormat = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const TYPE_ORDER: DiagnosticEntry["type"][] = ["error", "vital", "cache", "sw", "nav"];

// Stable reference for the server snapshot — a fresh [] on every call makes
// React warn about an unstable snapshot and loop.
const NO_ENTRIES: DiagnosticEntry[] = [];

// Device-local diagnostics: what just happened on THIS device (ring buffer in
// localStorage). Honest, scrubbed, and copyable — the "Kode laporan" flow on
// error pages points support at the same data.
const DeviceDiagnostics = (): JSX.Element => {
  const entries = useSyncExternalStore(subscribeDiagnostics, getDiagnostics, () => NO_ENTRIES);

  const copyAll = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(formatDiagnostics());
      showToast("Diagnostik disalin ke papan klip.");
    } catch {
      showToast("Gagal menyalin — izin papan klip ditolak.");
    }
  };

  const clear = (): void => {
    clearDiagnostics();
    showToast("Catatan diagnostik dibersihkan.");
  };

  return (
    <div className="card-shell">
      <div className="card-core p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">🧪 Diagnostik Perangkat Ini</h2>
            <p className="mt-1 max-w-prose text-sm text-ink-muted">
              Catatan lokal {entries.length} kejadian terakhir (galat, vitals, cache, service worker). Tidak dikirim ke
              mana pun kecuali Anda menyalinnya atau melaporkan galat.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyAll}
              disabled={entries.length === 0}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Salin diagnostik
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={entries.length === 0}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Bersihkan
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {TYPE_ORDER.map((type) => (
            <span key={type} className="chip">
              {TYPE_LABEL[type]}:{" "}
              <strong className="ml-1 text-ink">{entries.filter((e) => e.type === type).length}</strong>
            </span>
          ))}
        </div>

        {entries.length === 0 ? (
          <p className="rounded-sm border-2 border-border bg-surface-muted p-3 text-xs text-ink-muted">
            Belum ada catatan — perangkat ini bersih.
          </p>
        ) : (
          <ul className="space-y-1.5 font-mono text-[11px]">
            {entries
              .slice(-5)
              .reverse()
              .map((entry, index) => (
                <li
                  key={`${entry.at}-${index}`}
                  className="flex gap-2 rounded-sm border-2 border-border bg-surface p-2"
                >
                  <span className="shrink-0 text-ink-muted">{timeFormat.format(new Date(entry.at))}</span>
                  <span className="shrink-0 rounded-sm border border-border bg-surface-muted px-1.5 font-bold text-ink">
                    {TYPE_LABEL[entry.type]}
                  </span>
                  <span className="min-w-0 break-words text-ink-muted">{entry.detail}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeviceDiagnostics;
