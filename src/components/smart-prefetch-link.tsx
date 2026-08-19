"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps, JSX, ReactNode, useRef } from "react";

interface SmartPrefetchLinkProps extends LinkProps, Omit<ComponentProps<"a">, "href"> {
  children: ReactNode;
  delayMs?: number;
}

export const SmartPrefetchLink = ({
  href,
  children,
  delayMs = 150,
  onMouseEnter,
  onMouseLeave,
  ...props
}: SmartPrefetchLinkProps): JSX.Element => {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onMouseEnter?.(e);
    timerRef.current = setTimeout(() => {
      if (typeof href === "string") {
        router.prefetch(href);
      }
    }, delayMs);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onMouseLeave?.(e);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return (
    <Link href={href} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
      {children}
    </Link>
  );
};
