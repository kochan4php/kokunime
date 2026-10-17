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
      title="Gagal memuat halaman update"
      message="Feed update tidak bisa dimuat sekarang. Coba lagi sebentar lagi."
    />
  );
}
