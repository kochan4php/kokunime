"use client";

import { adminRequest, useAdminConsole } from "@/hooks/use-admin-console";
import { JSX, useState } from "react";

const PRESET_PATHS = ["/", "/update", "/genres", "/years", "/roulette"];

interface FeatureFlagView {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

// Ops console for the token-gated admin endpoints.
const AdminDashboard = (): JSX.Element => {
  const { token, logs, busy, saveToken, run } = useAdminConsole();
  const [flags, setFlags] = useState<FeatureFlagView[]>([]);

  const buttonClass =
    "inline-flex h-10 items-center rounded-sm border-2 border-border bg-surface px-4 font-mono text-xs font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const applyFlags = (body: unknown): void => {
    if (body && typeof body === "object" && Array.isArray((body as { flags?: unknown }).flags)) {
      setFlags((body as { flags: FeatureFlagView[] }).flags);
    }
  };

  const loadFlags = async (): Promise<void> => {
    await run("Feature flags", async () => {
      const result = await adminRequest("/api/admin/flags", token.trim(), { method: "GET" });
      applyFlags(result.body);
      return result;
    });
  };

  const toggleFlag = (flag: FeatureFlagView): void => {
    void run(`${flag.enabled ? "Matikan" : "Nyalakan"} flag ${flag.key}`, async () => {
      const result = await adminRequest("/api/admin/flags", token.trim(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: flag.key, enabled: !flag.enabled }),
      });
      if (result.ok) applyFlags(result.body);
      return result;
    });
  };

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
          onClick={() =>
            void run("Index status", () => adminRequest("/api/admin/index", token.trim(), { method: "GET" }))
          }
        >
          Index status
        </button>
        <button
          type="button"
          disabled={busy}
          className={buttonClass}
          onClick={() =>
            void run("Warm index (5 pages / 6 genres)", () =>
              adminRequest("/api/admin/index", token.trim(), {
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
              adminRequest("/api/admin/revalidate", token.trim(), {
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
          onClick={() => void run("Metrics", () => adminRequest("/api/metrics", token.trim(), { method: "GET" }))}
        >
          Metrics
        </button>
        <button
          type="button"
          disabled={busy}
          className={buttonClass}
          onClick={() =>
            void run("Vitals p75", () => adminRequest("/api/admin/vitals", token.trim(), { method: "GET" }))
          }
        >
          Vitals p75
        </button>
        <button
          type="button"
          disabled={busy}
          className={buttonClass}
          onClick={() =>
            void run("Uptime rollup + error budget", () =>
              adminRequest("/api/admin/uptime", token.trim(), { method: "GET" }),
            )
          }
        >
          Uptime &amp; SLO
        </button>
        <button
          type="button"
          disabled={busy}
          className={buttonClass}
          onClick={() =>
            void run("Slow requests", () => adminRequest("/api/admin/slow", token.trim(), { method: "GET" }))
          }
        >
          Slow requests
        </button>
        <button type="button" disabled={busy} className={buttonClass} onClick={() => void loadFlags()}>
          Feature flags
        </button>
      </div>

      {flags.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">Toggle flag:</span>
          {flags.map((flag) => (
            <button
              key={flag.key}
              type="button"
              disabled={busy}
              aria-pressed={flag.enabled}
              title={flag.description}
              onClick={() => toggleFlag(flag)}
              className={`inline-flex h-8 items-center rounded-sm border-2 border-border px-3 font-mono text-xs font-bold shadow-[2px_2px_0_0_var(--border)] transition-all cursor-pointer disabled:opacity-50 ${
                flag.enabled ? "bg-nb-lime text-nb-ink" : "bg-surface text-ink-muted"
              }`}
            >
              {flag.enabled ? "✓" : "✕"} {flag.label}
            </button>
          ))}
        </div>
      )}

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
