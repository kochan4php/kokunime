"use client";

import { type ReportKind, REPORT_KINDS } from "@/interfaces/report";
import { JSX, useState } from "react";

const KIND_LABELS: Record<ReportKind, string> = {
  dead_link: "Tautan unduhan mati",
  missing_episode: "Episode belum tersedia",
  metadata: "Data anime tidak sesuai",
};

type SubmitState = "idle" | "sending" | "sent" | "error";

// Link-free report intake. A report is stored only when the server has Redis;
// the UI repeats that limitation instead of showing a false success.
const ReportProblem = ({ slug }: { slug: string }): JSX.Element => {
  const [kind, setKind] = useState<ReportKind>("dead_link");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, kind, note, website }),
      });
      if (response.status === 201) {
        setState("sent");
        setMessage("Laporan terkirim. Terima kasih, akan kami periksa.");
        setNote("");
      } else if (response.status === 503) {
        setState("error");
        setMessage("Antrean laporan sedang tidak tersedia. Coba lagi nanti.");
      } else {
        setState("error");
        setMessage("Laporan belum bisa dikirim. Periksa pilihan dan catatan Anda.");
      }
    } catch {
      setState("error");
      setMessage("Jaringan bermasalah. Coba lagi sebentar lagi.");
    }
  };

  return (
    <details className="mt-10 rounded-sm border-2 border-border bg-surface p-4 shadow-[3px_3px_0_0_var(--border)]">
      <summary className="cursor-pointer font-mono text-sm font-bold text-ink">Laporkan masalah data</summary>
      <p className="mt-2 text-sm text-ink-muted">
        Tautan mati, episode hilang, atau data yang tidak sesuai. Jangan kirim tautan baru.
      </p>
      <form onSubmit={submit} className="mt-4 grid gap-3">
        <label className="grid gap-1 text-sm font-semibold text-ink" htmlFor="report-kind">
          Jenis masalah
          <select
            id="report-kind"
            value={kind}
            onChange={(event) => setKind(event.target.value as ReportKind)}
            className="rounded-sm border-2 border-border bg-surface-solid px-3 py-2 text-sm font-normal"
          >
            {REPORT_KINDS.map((value) => (
              <option key={value} value={value}>
                {KIND_LABELS[value]}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-semibold text-ink" htmlFor="report-note">
          Catatan <span className="font-normal text-ink-muted">(opsional, tanpa tautan)</span>
          <textarea
            id="report-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={300}
            rows={3}
            className="rounded-sm border-2 border-border bg-surface-solid px-3 py-2 text-sm font-normal"
            placeholder="Contoh: server 720p tidak bisa dibuka sejak kemarin."
          />
        </label>

        <div className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="report-website">Website</label>
          <input
            id="report-website"
            name="website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={state === "sending"} className="btn-primary !px-4 !py-2 text-sm">
            {state === "sending" ? "Mengirim…" : "Kirim laporan"}
          </button>
          <span className="font-mono text-xs text-ink-muted">{note.length}/300</span>
        </div>
        {message && (
          <p
            role="status"
            className={`text-sm ${state === "sent" ? "text-ink-muted" : "text-red-700 dark:text-red-300"}`}
          >
            {message}
          </p>
        )}
      </form>
    </details>
  );
};

export default ReportProblem;
