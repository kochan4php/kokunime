"use client";

import ErrorCard from "@/components/error-card";
import { formatDiagnostics, recordDiagnostic } from "@/utils/diagnostics";
import { JSX, useEffect, useState } from "react";

interface RouteErrorProps {
  error?: Error & { digest?: string };
  reset: () => void;
  title: string;
  message: string;
}

// Shared per-route error boundary body: reports the error once (with the local
// diagnostics ring buffer), then offers retry + home. Each route group only
// supplies contextual copy.
const RouteError = ({ error, reset, title, message }: RouteErrorProps): JSX.Element => {
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    const errorMessage = error?.message || "Unknown client error";
    recordDiagnostic("error", errorMessage);
    void fetch("/api/report-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error?.message || "Unknown client error",
        digest: error?.digest,
        path: typeof window !== "undefined" ? window.location.pathname : undefined,
        context: formatDiagnostics(),
      }),
    })
      .then((response) => response.json())
      .then((data: { id?: string }) => {
        if (typeof data?.id === "string") setReportId(data.id);
      })
      .catch(() => {});
  }, [error]);

  return (
    <ErrorCard code="500" label="Gagal memuat" title={title} message={message}>
      <div className="flex flex-col items-center gap-2">
        {reportId ? (
          <p className="font-mono text-[11px] text-ink-muted">
            Kode laporan: <span className="font-bold text-ink">{reportId}</span>
          </p>
        ) : null}
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <button onClick={() => reset()} className="btn-primary">
            Coba lagi
          </button>
          <a href="/" className="btn-secondary">
            Ke beranda
          </a>
        </div>
      </div>
    </ErrorCard>
  );
};

export default RouteError;
