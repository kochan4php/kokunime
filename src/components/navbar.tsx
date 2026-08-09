"use client";

import SearchForm from "./search-form";
import ThemeToggle from "./theme-toggle";
import { siteLinks } from "@/components/site-config";
import Link from "next/link";
import { JSX } from "react";

const Navbar = (): JSX.Element => (
  <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
    <div className="container flex items-center justify-between gap-4 px-4 py-3 md:px-6">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-tight text-ink transition-colors duration-200 hover:text-ink-muted"
        >
          <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-amber bg-clip-text text-transparent">
            Koku
          </span>
          nime
        </Link>
        <nav aria-label="Utama" className="hidden items-center gap-5 lg:flex">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <SearchForm className="hidden md:block" inputClassName="w-56 pl-10 lg:w-64" />
        <ThemeToggle />
      </div>
    </div>
    <div className="container px-4 pb-3 md:hidden">
      <SearchForm inputClassName="w-full pl-10" />
    </div>
  </header>
);

export default Navbar;
