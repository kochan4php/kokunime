"use client";

import { useRouter } from "next/navigation";
import { JSX } from "react";

const NotFoundPage = (): JSX.Element => {
  const router = useRouter();

  return (
    <section className="flex min-h-screen items-center justify-center px-4">
      <div className="card-shell max-w-lg w-full">
        <div className="card-core flex flex-col items-center gap-4 p-10 text-center">
          <span className="chip">404</span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Halaman tidak ditemukan</h1>
          <p className="text-ink-muted">Halaman ini nggak ada. Mungkin link-nya salah atau sudah dihapus.</p>
          <button onClick={() => router.push("/")} className="btn-primary mt-2">
            Kembali ke beranda
          </button>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
