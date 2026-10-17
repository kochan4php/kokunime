"use client";

import ErrorCard from "@/components/error-card";
import { JSX, useEffect } from "react";

interface RouteErrorProps {
  error?: Error & { digest?: string };
  reset: () => void;
  title: string;
  message: string;
}

// Shared per-route error boundary body: reports the error once and offers
// retry + home. Each route group only supplies contextual copy.
const RouteError = ({ error, reset, title, message }: RouteErrorProps): JSX.Element => {
  useEffect(() => {
    void fetch("/api/report-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error?.message || "Unknown client error",
        digest: error?.digest,
        path: typeof window !== "undefined" ? window.location.pathname : undefined,
      }),
    }).catch(() => {});
  }, [error]);

  return (
    <ErrorCard code="500" label="Gagal memuat" title={title} message={message}>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <button onClick={() => reset()} className="btn-primary">
          Coba lagi
        </button>
        <a href="/" className="btn-secondary">
          Ke beranda
        </a>
      </div>
    </ErrorCard>
  );
};

export default RouteError;
