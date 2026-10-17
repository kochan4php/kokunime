"use client";

import { JSX, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/utils/storage-keys";

const TOKEN_KEY = STORAGE_KEYS.adminToken;
const PRESET_PATHS = ["/", "/update", "/genres", "/years", "/roulette"];

interface LogEntry {
  at: string;
  text: string;
  ok: boolean;
}

const request = async (
  url: string,
  token: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; body: unknown; text: string }> => {
  const res = await fetch(url, {
    ...init,
    headers: { authorization: `Bearer ${token}`, ...(init?.headers ?? {}) },
  });
  const text = await res.text();
  let body: unknown = text;
  try {
    body = JSON.parse(text) as unknown;
  } catch {
    // Prometheus text or plain error message — keep raw.
  }
  return { ok: res.ok, status: res.status, body, text };
};

// Ops console for the token-gated admin endpoints. The token lives only in
// sessionStorage on this device; every call carries it as a Bearer header.
const AdminDashboard = (): JSX.Element => {
  const [token, setToken] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(TOKEN_KEY);
      if (saved) setToken(saved);
    } catch {
      // Storage blocked — token typed per session.
    }
  }, []);

  const saveToken = (value: string): void => {
    setToken(value);
    try {
      window.sessionStorage.setItem(TOKEN_KEY, value);
    } catch {
      // Ignore.
    }
  };

  const log = (text: string, ok: boolean): void => {
    setLogs((prev) => [{ at: new Date().toLocaleTimeString(), text, ok }, ...prev].slice(0, 12));
  };

  const run = async (
    label: string,
    fn: () => Promise<{ ok: boolean; status: number; body: unknown; text: string }>,
  ) => {
    if (!token.trim()) {
      log(`${label}: isi token dulu`, false);
      return;
    }
    setBusy(true);
    try {
      const result = await fn();
      const summary =
        typeof result.body === "string" ? result.body.slice(0, 1200) : JSON.stringify(result.body).slice(0, 1200);
      log(`${label} → HTTP ${result.status}\n${summary}`, result.ok);
    } catch {
      log(`${label}: gagal terhubung`, false);
    } finally {
      setBusy(false);
    }
  };

  const buttonClass =
    "inline-flex h-10 items-center rounded-sm border-2 border-border bg-surface px-4 font-mono text-xs font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">🛠 Admin Ops</h1>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
        Index warm-up · cache revalidate · metrics
      </p>

      <label className="mt-6 block">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink-muted">
          Bearer token (ADMIN_TOKEN / METRICS_TOKEN)
        </span>
        <input
          type="password"
          value={token}
          onChange={(event) => saveToken(event.target.value)}
          autoComplete="off"
          placeholder="••••••••"
          className="mt-1 w-full rounded-sm border-2 border-border bg-surface px-3 py-2 font-mono text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          className={buttonClass}
          onClick={() => void run("Index status", () => request("/api/admin/index", token.trim(), { method: "GET" }))}
        >
          Index status
        </button>
        <button
          type="button"
          disabled={busy}
          className={buttonClass}
          onClick={() =>
            void run("Warm index (5 pages / 6 genres)", () =>
              request("/api/admin/index", token.trim(), {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ pages: 5, genres: 6 }),
              }),
            )
          }
        >
          Warm index
        </button>
        <button
          type="button"
          disabled={busy}
          className={buttonClass}
          onClick={() =>
            void run(`Revalidate ${PRESET_PATHS.join(", ")}`, () =>
              request("/api/admin/revalidate", token.trim(), {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ paths: PRESET_PATHS }),
              }),
            )
          }
        >
          Revalidate preset
        </button>
        <button
          type="button"
          disabled={busy}
          className={buttonClass}
          onClick={() => void run("Metrics", () => request("/api/metrics", token.trim(), { method: "GET" }))}
        >
          Metrics
        </button>
      </div>

      <p className="mt-3 font-mono text-[10px] text-ink-muted">
        Metrics butuh METRICS_TOKEN; endpoint admin menerima ADMIN_TOKEN atau METRICS_TOKEN. Tanpa token terkonfigurasi,
        semua endpoint membalas 404.
      </p>

      <div className="mt-6 space-y-2" aria-live="polite">
        {logs.length === 0 ? (
          <p className="font-mono text-xs text-ink-muted">Belum ada aksi.</p>
        ) : (
          logs.map((entry, index) => (
            <pre
              key={`${entry.at}-${index}`}
              className={`overflow-x-auto whitespace-pre-wrap rounded-sm border-2 border-border p-3 font-mono text-[11px] leading-snug ${
                entry.ok ? "bg-surface text-ink" : "bg-nb-red/20 text-ink"
              }`}
            >
              {`[${entry.at}] ${entry.text}`}
            </pre>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
