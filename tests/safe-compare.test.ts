import { describe, expect, it } from "vitest";
import { safeCompare } from "@/lib/safe-compare";

describe("safeCompare", () => {
  it("accepts an exact match and rejects a mismatch", () => {
    expect(safeCompare("token-abc-123", "token-abc-123")).toBe(true);
    expect(safeCompare("token-abc-123", "token-abc-124")).toBe(false);
  });

  it("handles length mismatches without throwing or shortcutting", () => {
    expect(safeCompare("short", "a-much-longer-token-value")).toBe(false);
    expect(safeCompare("", "x")).toBe(false);
    expect(safeCompare("", "")).toBe(true);
  });
});
