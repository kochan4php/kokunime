import { describe, expect, it } from "vitest";
import { MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths } from "@/lib/admin-revalidate";

describe("sanitizeRevalidatePaths", () => {
  it("accepts a short list of relative site paths", () => {
    expect(sanitizeRevalidatePaths(["/", "/anime/one-piece", "/genres/action"])).toEqual([
      "/",
      "/anime/one-piece",
      "/genres/action",
    ]);
  });

  it("rejects non-arrays, empty lists, and oversized lists", () => {
    expect(sanitizeRevalidatePaths("/")).toBeNull();
    expect(sanitizeRevalidatePaths([])).toBeNull();
    expect(sanitizeRevalidatePaths(new Array(MAX_REVALIDATE_PATHS + 1).fill("/"))).toBeNull();
  });

  it("rejects absolute URLs, protocol-relative, traversal, query and hash", () => {
    for (const bad of [
      ["https://evil.example/"],
      ["//evil.example"],
      ["/a/../b"],
      ["/path?x=1"],
      ["/path#frag"],
      ["/path\\x"],
      ["not-relative"],
    ]) {
      expect(sanitizeRevalidatePaths(bad)).toBeNull();
    }
  });

  it("rejects non-string entries", () => {
    expect(sanitizeRevalidatePaths(["/ok", 42])).toBeNull();
  });
});
