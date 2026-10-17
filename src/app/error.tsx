"use client";

import ErrorCard from "@/components/error-card";
import { JSX, useEffect } from "react";

const Error = ({ reset, error }: { reset: () => void; error?: Error & { digest?: string } }): JSX.Element => {
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
    <ErrorCard
      code="500"
      label="Ada yang salah"
      title="Terjadi kesalahan"
      message="Halaman ini gagal dimuat. Coba muat ulang nanti, atau kembali ke beranda."
    >
      <button onClick={() => reset()} className="btn-primary mt-2">
        Muat ulang
      </button>
    </ErrorCard>
  );
};

export default Error;
