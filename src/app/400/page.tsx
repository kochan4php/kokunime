import ErrorCard from "@/components/error-card";
import Link from "next/link";
import { Metadata } from "next";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "400 · Permintaan Tidak Valid",
  robots: { index: false },
};

const BadRequestPage = (): JSX.Element => (
  <ErrorCard
    code="400"
    label="Permintaan tidak valid"
    title="Link-nya salah format"
    message="Permintaan ke halaman ini nggak bisa diproses. Cek link kamu atau mulai dari beranda."
  >
    <Link href="/" className="btn-primary mt-2">
      Kembali ke beranda
    </Link>
  </ErrorCard>
);

export default BadRequestPage;
