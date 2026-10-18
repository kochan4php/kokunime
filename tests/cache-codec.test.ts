import { describe, expect, it } from "vitest";
import { CACHE_CODEC, decodeCacheValue, encodeCacheValue } from "@/lib/cache-codec";

describe("cache codec", () => {
  it("keeps small values as plain JSON (no prefix, no CPU spent)", async () => {
    const encoded = await encodeCacheValue({ a: 1 });
    expect(encoded).toBe('{"a":1}');
    expect(encoded.startsWith(CACHE_CODEC.prefix)).toBe(false);
  });

  it("compresses values past the threshold and round-trips them", async () => {
    const big = { body: "x".repeat(CACHE_CODEC.thresholdChars * 3) };
    const encoded = await encodeCacheValue(big);
    expect(encoded.startsWith(CACHE_CODEC.prefix)).toBe(true);
    expect(encoded.length).toBeLessThan(JSON.stringify(big).length);
    expect(await decodeCacheValue(encoded)).toEqual(big);
  });

  it("reads legacy uncompressed entries written before this codec existed", async () => {
    expect(await decodeCacheValue('{"legacy":true}')).toEqual({ legacy: true });
  });

  it("round-trips unicode payloads", async () => {
    const value = { title: "Kōri no Jōheki — 氷の城壁 🌸", pad: "y".repeat(4000) };
    expect(await decodeCacheValue(await encodeCacheValue(value))).toEqual(value);
  });

  it("keeps null and arrays intact", async () => {
    expect(await decodeCacheValue(await encodeCacheValue(null))).toBeNull();
    expect(await decodeCacheValue(await encodeCacheValue([1, 2, 3]))).toEqual([1, 2, 3]);
  });

  it("throws on a corrupt compressed payload (callers treat it as a cache miss)", async () => {
    await expect(decodeCacheValue(`${CACHE_CODEC.prefix}not-valid-base64!!!`)).rejects.toThrow();
  });
});
