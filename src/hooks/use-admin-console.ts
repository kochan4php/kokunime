"use client";

import { STORAGE_KEYS } from "@/utils/storage-keys";
import { useEffect, useState } from "react";

const TOKEN_KEY = STORAGE_KEYS.adminToken;

interface AdminLogEntry {
  at: string;
  text: string;
  ok: boolean;
}

interface AdminRequestResult {
  ok: boolean;
  status: number;
  body: unknown;
  text: string;
}

// Fetches with the Bearer token and normalizes the reply so the console can
// render Prometheus text and JSON payloads with the same code path.
export const adminRequest = async (url: string, token: string, init?: RequestInit): Promise<AdminRequestResult> => {
  const res = await fetch(url, {
    ...init,
    headers: { authorization: `Bearer ${token}`, ...(init?.headers ?? {}) },
  });
  const text = await res.text();
  let body: unknown = text;
  try {
    body = JSON.parse(text) as unknown;
  } catch {
    // Prometheus text or plain error message — keep raw.
  }
  return { ok: res.ok, status: res.status, body, text };
};

interface UseAdminConsoleResult {
  token: string;
  logs: AdminLogEntry[];
  busy: boolean;
  saveToken: (value: string) => void;
  run: (label: string, fn: () => Promise<AdminRequestResult>) => Promise<void>;
}

// Ops-console state: the token lives only in sessionStorage on this device;
// every call carries it as a Bearer header.
export const useAdminConsole = (): UseAdminConsoleResult => {
  const [token, setToken] = useState("");
  const [logs, setLogs] = useState<AdminLogEntry[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(TOKEN_KEY);
      if (saved) setToken(saved);
    } catch {
      // Storage blocked — token typed per session.
    }
  }, []);

  const saveToken = (value: string): void => {
    setToken(value);
    try {
      window.sessionStorage.setItem(TOKEN_KEY, value);
    } catch {
      // Ignore.
    }
  };

  const log = (text: string, ok: boolean): void => {
    setLogs((prev) => [{ at: new Date().toLocaleTimeString(), text, ok }, ...prev].slice(0, 12));
  };

  const run = async (label: string, fn: () => Promise<AdminRequestResult>) => {
    if (!token.trim()) {
      log(`${label}: isi token dulu`, false);
      return;
    }
    setBusy(true);
    try {
      const result = await fn();
      const summary =
        typeof result.body === "string" ? result.body.slice(0, 1200) : JSON.stringify(result.body).slice(0, 1200);
      log(`${label} → HTTP ${result.status}\n${summary}`, result.ok);
    } catch {
      log(`${label}: gagal terhubung`, false);
    } finally {
      setBusy(false);
    }
  };

  return { token, logs, busy, saveToken, run };
};
