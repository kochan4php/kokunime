"use client";

import { SearchIcon } from "@/components/icons";
import Input from "./input";
import { useRouter } from "next/navigation";
import React, { JSX, useState } from "react";

interface SearchFormProps {
  className?: string;
  inputClassName?: string;
  onSubmit?: () => void;
}

const SearchForm = ({ className = "", inputClassName = "pl-10", onSubmit }: SearchFormProps): JSX.Element => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;
    router.push(`/search/${encodeURIComponent(query)}`);
    onSubmit?.();
  };

  return (
    <form onSubmit={submitHandler} className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
        <SearchIcon />
      </span>
      <Input
        type="search"
        name="search"
        placeholder="Cari anime…"
        ariaLabel="Cari anime"
        autoComplete="off"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            if (inputValue) {
              setInputValue("");
            } else {
              (e.target as HTMLInputElement).blur();
            }
          }
        }}
        className={inputClassName}
      />
    </form>
  );
};

export default SearchForm;
