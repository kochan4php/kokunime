import Link from "next/link";
import { JSX } from "react";

const EmptyState = (): JSX.Element => (
  <div className="card-shell mt-12 max-w-xl">
    <div className="card-core flex flex-col gap-4 p-8 md:p-10">
      <p className="text-ink-muted">Nggak ada hasil buat kata kunci ini. Coba kata lain atau balik ke beranda.</p>
      <Link href="/" className="btn-primary w-max">
        Kembali ke beranda
      </Link>
    </div>
  </div>
);

export default EmptyState;
