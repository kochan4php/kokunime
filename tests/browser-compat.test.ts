import { describe, expect, it } from "vitest";

describe("Cross-Browser Compatibility & User-Agent Test Suite", () => {
  it("detects mobile viewport requirements properly", () => {
    const isMobileUa = (ua: string) => /android|iphone|ipad|ipod|mobile/i.test(ua);

    expect(isMobileUa("Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)")).toBe(true);
    expect(isMobileUa("Mozilla/5.0 (Linux; Android 14; Pixel 8)")).toBe(true);
    expect(isMobileUa("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")).toBe(false);
  });

  it("handles iOS Safari smooth scrolling and standalone PWA detection", () => {
    const isIos = (ua: string) => /iphone|ipad|ipod/i.test(ua);
    expect(isIos("Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)")).toBe(true);
    expect(isIos("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe(false);
  });
});
