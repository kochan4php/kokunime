"use client";

import { JSX, ReactNode, useEffect, useState } from "react";
import { runWhenIdle } from "@/utils/idle";

interface DeferHydrationProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function DeferHydration({ children, fallback = null }: DeferHydrationProps): JSX.Element {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    runWhenIdle(() => setIsReady(true), 500);
  }, []);

  if (!isReady) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
