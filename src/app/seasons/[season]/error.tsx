"use client";

import RouteError from "@/components/route-error";
import { JSX } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  return (
    <RouteError
      error={error}
      reset={reset}
      title="Gagal memuat halaman musim"
      message="Daftar anime musim ini tidak bisa dimuat sekarang. Coba muat ulang."
    />
  );
}
