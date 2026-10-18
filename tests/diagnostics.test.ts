// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
  clearDiagnostics,
  formatDiagnostics,
  getDiagnostics,
  MAX_ENTRIES,
  recordDiagnostic,
  scrubDiagnostic,
  subscribeDiagnostics,
} from "@/utils/diagnostics";

describe("device diagnostics", () => {
  beforeEach(() => {
    clearDiagnostics();
    window.localStorage.clear();
  });

  it("caps the ring buffer at MAX_ENTRIES (oldest fall out)", () => {
    for (let i = 0; i < MAX_ENTRIES + 12; i++) recordDiagnostic("nav", `pindah ${i}`);
    const entries = getDiagnostics();
    expect(entries).toHaveLength(MAX_ENTRIES);
    expect(entries[0]?.detail).toBe("pindah 12");
    expect(entries[entries.length - 1]?.detail).toBe(`pindah ${MAX_ENTRIES + 11}`);
  });

  it("scrubs e-mails, tokens and bearer credentials before storing", () => {
    recordDiagnostic("error", "gagal kirim ke budi@example.com?token=abc123&x=1 Bearer sk_live_1234567890");
    const detail = getDiagnostics()[0]?.detail ?? "";
    expect(detail).not.toContain("budi@example.com");
    expect(detail).not.toContain("abc123");
    expect(detail).toContain("[email]");
    expect(detail).toContain("[redacted]");
  });

  it("truncates a very long detail instead of blowing up storage", () => {
    recordDiagnostic("error", "x".repeat(5000));
    expect((getDiagnostics()[0]?.detail ?? "").length).toBeLessThanOrEqual(160);
  });

  it("persists entries so /status survives a reload", () => {
    recordDiagnostic("vital", "LCP=1200ms di /");
    expect(window.localStorage.getItem("kokunime_diagnostics")).toContain("LCP=1200ms");
  });

  it("clears storage and notifies subscribers", () => {
    let notified = 0;
    const unsubscribe = subscribeDiagnostics(() => {
      notified += 1;
    });
    recordDiagnostic("sw", "Terdaftar build=dev");
    clearDiagnostics();
    unsubscribe();
    expect(getDiagnostics()).toHaveLength(0);
    expect(window.localStorage.getItem("kokunime_diagnostics")).toBeNull();
    expect(notified).toBe(2);
  });

  it("formats a copyable report with build, route and counts", () => {
    recordDiagnostic("cache", "Service worker melaporkan data mungkin basi");
    const text = formatDiagnostics();
    expect(text).toContain("Kokunime diagnostics");
    expect(text).toContain("build=");
    expect(text).toContain("counts:");
    expect(text).toContain("cache=1");
    expect(text).toContain("[cache]");
  });

  it("redacts long hashes", () => {
    expect(scrubDiagnostic("hash abcdef0123456789abcdef0123456789 end")).toContain("[hash]");
  });
});
