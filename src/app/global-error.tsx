"use client";

import ErrorCard from "@/components/error-card";
import { JSX } from "react";

// Root-level error boundary: catches errors in the root layout itself,
// which the per-segment error.tsx cannot. Must render its own <html>/<body>
// (it replaces the root layout). Without this, a root-layout crash = blank
// site with no recovery UI.
const GlobalError = ({ reset }: { reset: () => void }): JSX.Element => (
  <html lang="id">
    <body>
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
    </body>
  </html>
);

export default GlobalError;
