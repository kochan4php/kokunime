"use client";

import { applyTheme, getStoredSettings } from "@/utils/settings";
import { JSX, useEffect } from "react";

// The pre-paint script applies the stored theme; this keeps it live once React
// is running: OS switches while the tab is open ("system" mode) and changes
// made in another tab.
const ThemeSync = (): JSX.Element | null => {
  useEffect(() => {
    const sync = () => applyTheme(getStoredSettings().theme);
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return null;
};

export default ThemeSync;
