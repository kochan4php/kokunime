import { describe, expect, it } from "vitest";
import { parseVitalsPayload } from "@/lib/vitals-payload";

describe("vitals payload", () => {
  it("accepts LoAF with device and connection dimensions", () => {
    expect(
      parseVitalsPayload({ name: "LoAF", value: 320, path: "/anime/x", deviceType: "mobile", connection: "3g" }),
    ).toEqual({ name: "LoAF", value: 320, path: "/anime/x", deviceType: "mobile", connection: "3g" });
  });

  it("rejects unknown metrics, absurd values, and non-page paths", () => {
    expect(parseVitalsPayload({ name: "FID", value: 100, path: "/x" })).toBeNull();
    expect(parseVitalsPayload({ name: "LCP", value: -1, path: "/x" })).toBeNull();
    expect(parseVitalsPayload({ name: "LCP", value: 60_001, path: "/x" })).toBeNull();
    expect(parseVitalsPayload({ name: "LCP", value: 1000, path: "https://evil.example" })).toBeNull();
    expect(parseVitalsPayload("nope")).toBeNull();
  });

  it("drops dimensions outside the allowlists", () => {
    const payload = parseVitalsPayload({
      name: "INP",
      value: 120,
      path: "/x",
      deviceType: "smart-fridge",
      connection: "5g",
    });
    expect(payload).toEqual({ name: "INP", value: 120, path: "/x", deviceType: undefined, connection: undefined });
  });

  it("normalizes search queries and strips control characters from paths", () => {
    expect(parseVitalsPayload({ name: "INP", value: 100, path: "/search/secret%20query" })?.path).toBe(
      "/search/[query]",
    );
    expect(parseVitalsPayload({ name: "INP", value: 100, path: "/anime/a\u0000b\nc" })?.path).toBe("/anime/abc");
    expect(parseVitalsPayload({ name: "INP", value: 100, path: "/search" })?.path).toBe("/search");
  });

  it("caps the stored path", () => {
    const payload = parseVitalsPayload({ name: "LCP", value: 1000, path: `/${"a".repeat(300)}` });
    expect(payload?.path).toHaveLength(200);
  });
});
