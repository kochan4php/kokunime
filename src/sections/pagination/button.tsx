import { JSX, ReactNode } from "react";
import Link from "next/link";

interface PaginationButtonProps {
  href: string | null;
  label: string;
  variant?: "glass" | "primary";
  className?: string;
  children: ReactNode;
}

const PaginationButton = ({
  href,
  label,
  variant = "glass",
  className,
  children,
}: PaginationButtonProps): JSX.Element => {
  const defaultClass =
    variant === "primary"
      ? "btn-primary inline-flex h-10 items-center gap-1.5 rounded-sm px-5 text-sm"
      : "glass inline-flex h-10 items-center gap-1.5 rounded-sm px-5 text-sm font-semibold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--border)] active:translate-y-0 active:shadow-none";
  const cls = className ?? defaultClass;

  return href ? (
    <Link href={href} aria-label={label} className={cls}>
      {children}
    </Link>
  ) : (
    <span aria-disabled="true" className={`${cls} cursor-not-allowed opacity-50`}>
      {children}
    </span>
  );
};

export default PaginationButton;
