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
      ? "btn-primary inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-sm"
      : "glass inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-sm font-semibold text-ink transition-all duration-300 hover:text-accent active:scale-95";
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
