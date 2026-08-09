import { JSX, ReactNode } from "react";
import Link from "next/link";

interface PaginationButtonProps {
  href: string | null;
  label: string;
  variant?: "glass" | "primary";
  children: ReactNode;
}

const PaginationButton = ({ href, label, variant = "glass", children }: PaginationButtonProps): JSX.Element => {
  const className =
    variant === "primary"
      ? "btn-primary inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-sm"
      : "glass inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-sm font-semibold text-ink transition-all duration-300 hover:text-accent active:scale-95";

  return href ? (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  ) : (
    <span aria-disabled="true" className={`${className} cursor-not-allowed opacity-50`}>
      {children}
    </span>
  );
};

export default PaginationButton;
