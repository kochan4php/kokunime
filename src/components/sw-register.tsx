"use client";

import { useEffect } from "react";

const ServiceWorkerRegister = (): null => {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
};

export default ServiceWorkerRegister;
