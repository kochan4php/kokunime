"use client";

import { SITE_URL } from "@/lib/site";
import { JSX, useEffect, useState } from "react";

export interface ApiEndpoint {
  method: "GET" | "POST";
  path: string;
  category: "General" | "Catalog" | "Detail" | "Feed & Spec";
  description: string;
  sampleUrl: string;
  defaultParam?: { key: string; value: string; placeholder: string };
  paramsDescription?: string;
  responsePreview?: string;
}

interface ApiTesterProps {
  endpoint: ApiEndpoint;
}

type CodeLang = "curl" | "javascript" | "python" | "php" | "go";

const ApiTester = ({ endpoint }: ApiTesterProps): JSX.Element => {
  const [origin, setOrigin] = useState(SITE_URL);
  const [paramVal, setParamVal] = useState(endpoint.defaultParam?.value || "");
  const [activeLang, setActiveLang] = useState<CodeLang>("curl");
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [timeMs, setTimeMs] = useState<number | null>(null);
  const [resSize, setResSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Compute live URL based on customizable parameter
  const getLiveUrl = (): string => {
    if (!endpoint.defaultParam || !paramVal) return endpoint.sampleUrl;
    if (endpoint.path.includes("{slug}")) {
      return `/api/anime/${encodeURIComponent(paramVal)}${endpoint.path.includes("/download") ? "/download" : ""}`;
    }
    if (endpoint.path.includes("{genre}")) {
      return `/api/genres/${encodeURIComponent(paramVal)}`;
    }
    if (endpoint.path.includes("{season}")) {
      return `/api/seasons/${encodeURIComponent(paramVal)}`;
    }
    if (endpoint.path.includes("q={query}")) {
      return `/api/search?q=${encodeURIComponent(paramVal)}`;
    }
    return endpoint.sampleUrl;
  };

  const currentUrl = getLiveUrl();

  const handleTest = async () => {
    setLoading(true);
    setResponse(null);
    setStatus(null);
    setTimeMs(null);
    setResSize(null);

    const start = performance.now();
    try {
      const res = await fetch(currentUrl);
      const duration = Math.round(performance.now() - start);
      setTimeMs(duration);
      setStatus(res.status);

      const text = await res.text();
      const bytes = new Blob([text]).size;
      setResSize(bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`);

      try {
        const json = JSON.parse(text);
        setResponse(JSON.stringify(json, null, 2));
      } catch {
        setResponse(text);
      }
    } catch (err) {
      setResponse(String(err));
      setStatus(500);
    } finally {
      setLoading(false);
    }
  };

  const getCodeSnippet = (lang: CodeLang): string => {
    const fullUrl = `${origin}${currentUrl}`;

    switch (lang) {
      case "curl":
        return `curl -X GET "${fullUrl}" \\
  -H "Accept: application/json"`;

      case "javascript":
        return `const response = await fetch("${fullUrl}");
const data = await response.json();
console.log(data);`;

      case "python":
        return `import requests

response = requests.get("${fullUrl}")
data = response.json()
print(data)`;

      case "php":
        return `<?php
$ch = curl_init("${fullUrl}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data);`;

      case "go":
        return `package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    resp, err := http.Get("${fullUrl}")
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`;
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getCodeSnippet(activeLang));
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const handleCopyJson = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {}
  };

  return (
    <div className="card-shell overflow-hidden">
      <div className="card-core p-5 sm:p-6 space-y-4">
        {/* Header: Method, Endpoint Path, and Category */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 font-mono text-xs font-bold text-emerald-400 shrink-0">
              {endpoint.method}
            </span>
            <code className="font-mono text-xs sm:text-sm font-bold text-ink break-all">
              {endpoint.path}
            </code>
          </div>

          <span className="self-start sm:self-auto rounded-full bg-surface-muted px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink-muted shrink-0">
            {endpoint.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          {endpoint.description}
        </p>

        {/* Parameter Configuration input (if available) */}
        {endpoint.defaultParam && (
          <div className="p-3.5 rounded-2xl bg-surface/60 border border-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold text-accent">
                ⚙️ Parameter Input: <span className="text-ink">{endpoint.defaultParam.key}</span>
              </span>
              {endpoint.paramsDescription && (
                <span className="text-[10px] text-ink-muted">{endpoint.paramsDescription}</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={endpoint.defaultParam.placeholder}
                value={paramVal}
                onChange={(e) => setParamVal(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-surface px-3 py-1.5 font-mono text-xs text-ink outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={handleTest}
                disabled={loading}
                className="btn-primary !h-8 !px-4 !text-xs cursor-pointer shrink-0"
              >
                {loading ? "Memanggil..." : "⚡ Kirim Request"}
              </button>
            </div>
          </div>
        )}

        {!endpoint.defaultParam && (
          <div className="flex items-center justify-between pt-1">
            <span className="font-mono text-xs text-ink-muted">
              Target URL: <code className="text-accent">{endpoint.sampleUrl}</code>
            </span>
            <button
              type="button"
              onClick={handleTest}
              disabled={loading}
              className="btn-primary !h-8 !px-4 !text-xs cursor-pointer shrink-0"
            >
              {loading ? "Memanggil..." : "⚡ Kirim Request"}
            </button>
          </div>
        )}

        {/* Code Snippet Tabs */}
        <div className="rounded-2xl border border-border bg-surface-solid overflow-hidden space-y-0">
          <div className="flex flex-wrap items-center justify-between border-b border-border bg-surface-muted/40 px-3 py-2 gap-2">
            <div className="flex items-center gap-1">
              {(["curl", "javascript", "python", "php", "go"] as CodeLang[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    activeLang === lang
                      ? "bg-accent text-(--accent-ink) shadow-xs"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="font-mono text-[10px] font-semibold text-ink-muted hover:text-accent transition-colors cursor-pointer"
            >
              {copiedCode ? "✓ Kode Disalin!" : "📋 Salin Kode"}
            </button>
          </div>

          <pre className="overflow-x-auto p-3 font-mono text-[11px] text-ink leading-relaxed">
            <code>{getCodeSnippet(activeLang)}</code>
          </pre>
        </div>

        {/* Live Response Viewer (if executed) */}
        {status !== null && (
          <div className="rounded-2xl border border-border bg-surface-solid overflow-hidden space-y-0 animate-fade-in">
            <div className="flex items-center justify-between border-b border-border bg-surface-muted/40 px-4 py-2 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span
                  className={`font-bold px-2 py-0.5 rounded-md ${
                    status >= 200 && status < 300
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {status} {status === 200 ? "OK" : status === 404 ? "Not Found" : "Status"}
                </span>
                {timeMs !== null && <span className="text-ink-muted">⚡ {timeMs} ms</span>}
                {resSize && <span className="text-ink-muted">📦 {resSize}</span>}
              </div>

              <button
                type="button"
                onClick={handleCopyJson}
                className="font-mono text-[10px] font-semibold text-ink-muted hover:text-accent transition-colors cursor-pointer"
              >
                {copiedJson ? "✓ JSON Disalin!" : "📋 Salin JSON"}
              </button>
            </div>

            <pre className="max-h-80 overflow-y-auto p-4 font-mono text-xs text-ink/90 leading-relaxed [scrollbar-width:thin]">
              <code>{response}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTester;
