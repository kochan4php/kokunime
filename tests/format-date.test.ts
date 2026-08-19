import { describe, expect, it } from "vitest";
import { formatLocalizedDate } from "@/utils/format-date";

describe("formatLocalizedDate utility", () => {
  it("formats dates into Indonesian locale by default", () => {
    const d = new Date(2026, 7, 19); // August 19, 2026
    expect(formatLocalizedDate(d, "id")).toBe("19 Agustus 2026");
  });

  it("formats dates into English locale when requested", () => {
    const d = new Date(2026, 7, 19);
    expect(formatLocalizedDate(d, "en")).toBe("19 August 2026");
  });

  it("handles string timestamps or invalid dates gracefully", () => {
    expect(formatLocalizedDate("2026-01-15T00:00:00Z", "id")).toContain("Januari 2026");
    expect(formatLocalizedDate("Spring 2026")).toBe("Spring 2026");
    expect(formatLocalizedDate(null)).toBe("");
  });
});
