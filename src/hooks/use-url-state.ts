"use client";

import { UrlStateSchema, UrlStateValues, readUrlState, writeUrlState } from "@/utils/url-state";
import { useCallback, useEffect, useRef, useState } from "react";

const WRITE_DELAY_MS = 250;

// Mirrors a small set of UI controls in the URL query without triggering a
// Next.js navigation: values are adopted from the URL inside an effect (so SSR
// and the first client render agree — no hydration mismatch), changes rewrite
// the current history entry after a short debounce, and back/forward re-adopts
// the URL values.
export const useUrlState = (schema: UrlStateSchema): [UrlStateValues, (patch: UrlStateValues) => void] => {
  const schemaRef = useRef(schema);
  const adopted = useRef(false);
  const [values, setValues] = useState<UrlStateValues>(schema.defaults);

  useEffect(() => {
    const read = () => setValues(readUrlState(window.location.search, schemaRef.current));
    read();
    adopted.current = true;
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  useEffect(() => {
    if (!adopted.current) return;
    const timer = window.setTimeout(() => {
      const query = writeUrlState(window.location.search, values, schemaRef.current);
      const url = `${window.location.pathname}${query}${window.location.hash}`;
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (url !== current) window.history.replaceState(window.history.state, "", url);
    }, WRITE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [values]);

  const update = useCallback((patch: UrlStateValues) => setValues((prev) => ({ ...prev, ...patch })), []);

  return [values, update];
};
