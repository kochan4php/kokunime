import { describe, expect, it } from "vitest";
import { buildSparklinePath } from "@/utils/sparkline";

describe("buildSparklinePath", () => {
  it("maps 100 to the top edge and the floor to the bottom edge", () => {
    expect(buildSparklinePath([100, 99], { height: 27, floor: 99 })).toBe("M0.00 0.00 L100.00 27.00");
  });

  it("breaks the line on missing days instead of interpolating them", () => {
    const path = buildSparklinePath([100, null, 100]);
    expect(path.split("M")).toHaveLength(3); // two segments
    expect(path).toContain("M0.00 0.00");
    expect(path).toContain("M100.00 0.00");
  });

  it("clamps values outside the floor..100 window", () => {
    expect(buildSparklinePath([120], { height: 28, floor: 98 })).toBe("M0.00 0.00");
    expect(buildSparklinePath([10], { height: 28, floor: 98 })).toBe("M0.00 28.00");
  });

  it("handles empty and single-value input without dividing by zero", () => {
    expect(buildSparklinePath([])).toBe("");
    expect(buildSparklinePath([null])).toBe("");
    expect(buildSparklinePath([99.5], { height: 20, floor: 99 })).toBe("M0.00 10.00");
  });
});
