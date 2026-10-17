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
      title="Gagal memuat detail anime"
      message="Data anime ini gagal dimuat — sumbernya mungkin sedang sibuk. Coba lagi sebentar lagi."
    />
  );
}
