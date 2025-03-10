"use client";

import { useEffect, useState } from "react";

export function useClientMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    console.log(mediaQueryList);

    const handleMatchChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQueryList.addEventListener("change", handleMatchChange);
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener("change", handleMatchChange);
    };
  }, [query]);

  return matches;
}
