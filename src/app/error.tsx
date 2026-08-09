"use client";

import { JSX } from "react";

const Error = (): JSX.Element => (
  <section className="flex min-h-screen items-center justify-center px-4">
    <div className="card-shell max-w-lg w-full">
      <div className="card-core flex flex-col items-center gap-4 p-10 text-center">
        <span className="chip">Error</span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Terjadi kesalahan</h1>
        <p className="text-ink-muted">Halaman ini gagal dimuat. Coba muat ulang nanti.</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-2">
          Coba lagi
        </button>
      </div>
    </div>
  </section>
);

export default Error;
