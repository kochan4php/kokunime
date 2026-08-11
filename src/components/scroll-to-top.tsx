"use client";

import { useLayoutEffect } from "react";

const ScrollToTop = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return null;
};

export default ScrollToTop;
