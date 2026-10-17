import { describe, expect, it } from "vitest";
import { parseSafeJson, stripDangerousKeys } from "@/lib/safe-json";

describe("safe json", () => {
  it("strips __proto__/constructor/prototype keys at every depth", () => {
    const parsed = parseSafeJson<Record<string, unknown>>(
      '{"a": 1, "__proto__": {"polluted": true}, "nested": {"constructor": {"prototype": {"x": 1}}, "keep": 2}}',
    );
    expect(parsed).toEqual({ a: 1, nested: { keep: 2 } });
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it("returns null for invalid JSON", () => {
    expect(parseSafeJson("{nope")).toBeNull();
  });

  it("fuzz: 200 fuzzed payloads never pollute Object.prototype", () => {
    let state = 20261018;
    const rng = () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 0xffffffff;
    };
    const keys = ["__proto__", "constructor", "prototype", "safe", "a", "toString"];
    for (let index = 0; index < 200; index++) {
      const outer = keys[Math.floor(rng() * keys.length)];
      const inner = keys[Math.floor(rng() * keys.length)];
      const parsed = parseSafeJson(`{"${outer}": {"polluted": true, "${inner}": {"polluted2": true}}, "safe": 1}`);
      expect(parsed).not.toBeNull();
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
      expect(({} as Record<string, unknown>).polluted2).toBeUndefined();
      expect(JSON.stringify(parsed)).not.toContain("__proto__");
    }
  });

  it("passes arrays and primitives through untouched", () => {
    expect(stripDangerousKeys([1, "a", null])).toEqual([1, "a", null]);
    expect(stripDangerousKeys(42)).toBe(42);
    expect(stripDangerousKeys("x")).toBe("x");
  });
});
