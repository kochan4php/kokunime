import { REPORT_KINDS } from "@/interfaces/report";
import { isReportStatus, sanitizeReportNote, validateReportInput } from "@/lib/reports";
import { describe, expect, it } from "vitest";

describe("report intake validation", () => {
  it("accepts each supported kind and trims the optional note", () => {
    for (const kind of REPORT_KINDS) {
      expect(validateReportInput({ slug: "one-piece", kind, note: "  server 720p mati " })).toEqual({
        slug: "one-piece",
        kind,
        note: "server 720p mati",
      });
    }
    expect(validateReportInput({ slug: "one-piece", kind: "dead_link" })).toMatchObject({ note: "" });
  });

  it("rejects unsafe slugs and unknown kinds", () => {
    expect(validateReportInput({ slug: "../admin", kind: "dead_link" })).toBeNull();
    expect(validateReportInput({ slug: "one-piece", kind: "other" })).toBeNull();
    expect(validateReportInput(null)).toBeNull();
  });

  it("rejects links, non-strings, and notes over the limit", () => {
    expect(validateReportInput({ slug: "one-piece", kind: "dead_link", note: "https://evil.example" })).toBeNull();
    expect(validateReportInput({ slug: "one-piece", kind: "dead_link", note: "www.evil.example" })).toBeNull();
    expect(validateReportInput({ slug: "one-piece", kind: "dead_link", note: 42 })).toBeNull();
    expect(sanitizeReportNote("x".repeat(300))).toBe("x".repeat(300));
    expect(sanitizeReportNote("x".repeat(301))).toBeNull();
  });

  it("recognizes only the two queue statuses", () => {
    expect(isReportStatus("open")).toBe(true);
    expect(isReportStatus("resolved")).toBe(true);
    expect(isReportStatus("pending")).toBe(false);
  });
});
