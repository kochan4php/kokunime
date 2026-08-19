"use client";

import { useEffect } from "react";

const ServiceWorkerRegister = (): null => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch(() => {});
    }
  }, []);

  return null;
};

export default ServiceWorkerRegister;
