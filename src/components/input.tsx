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
  onChange,
}: InputProps): JSX.Element => (
  <input
    className={`search-input h-11 w-full truncate rounded-full border border-border bg-surface px-4 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink-muted focus:border-accent focus:ring-2 focus:ring-accent/20 ${width ?? ""} ${className ?? ""}`}
    type={type}
    name={name}
    placeholder={placeholder}
    autoComplete={autoComplete}
    value={value}
    onChange={onChange}
  />
);

export default Input;
