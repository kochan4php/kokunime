import { describe, expect, it } from "vitest";
import { toTitle } from "@/utils/to-title";

describe("toTitle", () => {
  it("capitalizes each hyphenated word", () => {
    expect(toTitle("spring-2025")).toBe("Spring 2025");
  });

  it("handles a single word", () => {
    expect(toTitle("action")).toBe("Action");
  });
});
