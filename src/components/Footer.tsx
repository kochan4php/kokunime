import Link from "next/link";
import { JSX } from "react";

const Footer = (): JSX.Element => (
  <footer className="border-t border-border">
    <div className="container flex flex-col items-center justify-between gap-3 px-4 py-10 md:flex-row md:px-6">
      <Link
        href="/"
        className="font-display text-lg font-extrabold tracking-tight text-ink transition-colors duration-200 hover:text-ink-muted"
      >
        <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-cyan bg-clip-text text-transparent">
          Koku
        </span>
        nime
      </Link>
      <p className="font-mono text-xs text-ink-muted">Data sumber: kusonime.com</p>
      <p className="font-mono text-xs text-ink-muted">&copy; {new Date().getFullYear()} Kokunime</p>
    </div>
  </footer>
);

export default Footer;
