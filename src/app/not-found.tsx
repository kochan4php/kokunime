"use client";

import ErrorCard from "@/components/error-card";
import { useRouter } from "next/navigation";
import { JSX } from "react";

const NotFoundPage = (): JSX.Element => {
  const router = useRouter();

  return (
    <ErrorCard
      code="404"
      label="Halaman tidak ditemukan"
      title="Kayaknya kamu nyasar"
      message="Halaman ini nggak ada. Mungkin link-nya salah atau sudah dihapus."
    >
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <button onClick={() => router.push("/")} className="btn-primary">
          Kembali ke beranda
        </button>
        <button
          onClick={() => router.back()}
          className="glass inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-ink transition-all duration-300 hover:text-accent active:scale-95"
        >
          Balik ke halaman sebelumnya
        </button>
      </div>
    </ErrorCard>
  );
};

export default NotFoundPage;
