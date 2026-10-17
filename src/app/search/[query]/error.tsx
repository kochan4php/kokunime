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
      title="Pencarian gagal"
      message="Hasil pencarian tidak bisa dimuat sekarang. Coba ulangi kata kuncinya."
    />
  );
}
