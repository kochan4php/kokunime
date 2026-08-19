"use client";

import { JSX, useState } from "react";

export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  sampleUrl: string;
  params?: string;
}

interface ApiTesterProps {
  endpoint: ApiEndpoint;
}

const ApiTester = ({ endpoint }: ApiTesterProps): JSX.Element => {
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResponse(null);
    setStatus(null);
    try {
      const res = await fetch(endpoint.sampleUrl);
      setStatus(res.status);
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setResponse(JSON.stringify(json, null, 2));
      } catch {
        setResponse(text.slice(0, 1000));
      }
    } catch (err) {
      setResponse(String(err));
      setStatus(500);
    } finally {
      setLoading(false);
    }
  };

  const copyCurl = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://kokunime.netlify.app";
    const curlCmd = `curl -X GET "${origin}${endpoint.sampleUrl}"`;
    try {
      await navigator.clipboard.writeText(curlCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="card-shell">
      <div className="card-core p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="rounded-md bg-accent/15 px-2.5 py-1 font-mono text-xs font-bold text-accent border border-accent/30 shrink-0">
              {endpoint.method}
            </span>
            <code className="font-mono text-xs sm:text-sm font-semibold text-ink break-all">{endpoint.path}</code>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyCurl}
              className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs font-semibold text-ink-muted transition-all hover:border-accent hover:text-ink active:scale-95 cursor-pointer"
            >
              {copied ? "✓ cURL Disalin!" : "Salin cURL"}
            </button>
            <button
              type="button"
              onClick={handleTest}
              disabled={loading}
              className="btn-primary !h-8 !px-4 !text-xs cursor-pointer"
            >
              {loading ? "Memuat..." : "⚡ Coba Langsung"}
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-ink-muted leading-relaxed">{endpoint.description}</p>

        {endpoint.params && (
          <div className="mt-2 text-xs font-mono text-ink-muted/80">
            <span className="text-accent">Params:</span> {endpoint.params}
          </div>
        )}

        {response !== null && (
          <div className="mt-4 rounded-xl border border-border bg-surface-muted p-4">
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-ink-muted">
              <span>
                Status: <strong className={status === 200 ? "text-emerald-400" : "text-amber-400"}>{status}</strong>
              </span>
              <button type="button" onClick={() => setResponse(null)} className="hover:text-ink cursor-pointer">
                ✕ Tutup
              </button>
            </div>
            <pre className="max-h-64 overflow-auto rounded-lg bg-bg p-3 font-mono text-xs text-ink/90 [scrollbar-width:thin]">
              <code>{response}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTester;
