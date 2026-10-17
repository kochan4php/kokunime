import { InputProps } from "@/interfaces";
import { JSX } from "react";

const Input = ({
  width,
  className,
  type,
  name,
  placeholder,
  autoComplete,
  value,
  ariaLabel,
  onChange,
  onKeyDown,
}: InputProps): JSX.Element => (
  <input
    className={`search-input h-11 w-full truncate rounded-sm border-2 border-border bg-surface px-4 text-sm text-ink shadow-[2px_2px_0_0_var(--border)] outline-none transition-all duration-150 placeholder:text-ink-muted focus:border-accent ${width ?? ""} ${className ?? ""}`}
    type={type}
    name={name}
    placeholder={placeholder}
    aria-label={ariaLabel}
    autoComplete={autoComplete}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
  />
);

export default Input;
