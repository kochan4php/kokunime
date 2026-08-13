"use client";

import { JSX, ReactNode } from "react";

interface ErrorCardProps {
  code: string;
  label: string;
  title: string;
  message: string;
  children?: ReactNode;
}

const ErrorCard = ({ code, label, title, message, children }: ErrorCardProps): JSX.Element => (
  // <main id="konten">: error pages render outside MainLayout, so without
  // this the skip link (#konten) in layout.tsx points at nothing — keyboard
  // users pressing it on a 404/error page would go nowhere.
  <main id="konten" tabIndex={-1} className="flex min-h-screen items-center justify-center px-4">
    <div className="card-shell w-full max-w-lg">
      <div className="card-core flex flex-col items-center gap-4 p-10 text-center">
        <span className="bg-gradient-to-br from-accent via-accent-2 to-accent-amber bg-clip-text font-display text-7xl font-extrabold tracking-tight text-transparent md:text-8xl">
          {code}
        </span>
        <span className="chip">{label}</span>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">{title}</h1>
        <p className="max-w-sm text-ink-muted">{message}</p>
        {children}
      </div>
    </div>
  </main>
);

export default ErrorCard;
