"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { JSX, useState } from "react";
import Input from "./Input";
import ThemeToggle from "./ThemeToggle";

const SearchIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const Navbar = (): JSX.Element => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");

  const searchFunc = (e: React.ChangeEvent<HTMLInputElement>): void => setInputValue(e.target.value);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;
    router.push(`/search/${query.split(" ").join("+")}`);
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-3">
      <nav className="glass mx-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2">
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-tight text-ink transition-colors duration-200 hover:text-ink-muted"
        >
          <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-cyan bg-clip-text text-transparent">
            Koku
          </span>
          nime
        </Link>
        <div className="flex items-center gap-2">
          <form onSubmit={submitHandler} className="relative hidden md:block">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
              <SearchIcon />
            </span>
            <Input
              type="search"
              name="search"
              placeholder="Cari anime…"
              autoComplete="off"
              value={inputValue}
              onChange={searchFunc}
              className="w-56 pl-10 lg:w-64"
            />
          </form>
          <ThemeToggle />
        </div>
      </nav>
      <div className="mx-auto mt-2 max-w-5xl md:hidden">
        <form onSubmit={submitHandler} className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
            <SearchIcon />
          </span>
          <Input
            type="search"
            name="search"
            placeholder="Cari anime…"
            autoComplete="off"
            value={inputValue}
            onChange={searchFunc}
            width="w-full"
            className="pl-10"
          />
        </form>
      </div>
    </header>
  );
};

export default Navbar;
