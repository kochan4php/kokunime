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
      title="Gagal memuat halaman genre"
      message="Daftar anime untuk genre ini tidak bisa dimuat sekarang. Coba muat ulang."
    />
  );
}
