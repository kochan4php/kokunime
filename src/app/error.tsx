"use client";

import ErrorCard from "@/components/error-card";
import { JSX } from "react";

const Error = (): JSX.Element => (
  <ErrorCard
    code="500"
    label="Ada yang salah"
    title="Terjadi kesalahan"
    message="Halaman ini gagal dimuat. Coba muat ulang nanti, atau kembali ke beranda."
  >
    <button onClick={() => window.location.reload()} className="btn-primary mt-2">
      Muat ulang
    </button>
  </ErrorCard>
);

export default Error;
