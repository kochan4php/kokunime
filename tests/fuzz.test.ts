// @vitest-environment node
// Deterministic fuzz pass over the pure parsers: garbage in, no throws,
// invariants intact. Seeded LCG so failures reproduce.
import { describe, expect, it } from "vitest";
import { parseQuerySyntax } from "@/utils/query-syntax";
import { decodeCursor } from "@/lib/api-pagination";
import { parseFieldsParam, projectRecord } from "@/lib/api-projection";
import { fuzzyScore, highlightSegments } from "@/utils/fuzzy";
import { animeSlug, endpointSlug, normalizeSlug } from "@/utils/endpoint-slug";
import { sanitizeQuery } from "@/services/scraper/sanitize";

const CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -_:,+/%\\\"'<>&#[](){}?!@$^*=;.\u0000\u200B😀";

const makeRng = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
};

const randomString = (rng: () => number, max = 60): string => {
  const length = Math.floor(rng() * max);
  let out = "";
  for (let i = 0; i < length; i++) out += CHARS[Math.floor(rng() * CHARS.length)];
  return out;
};

const rng = makeRng(20261017);

describe("fuzz: parsers never throw and keep their invariants", () => {
  it("parseQuerySyntax always returns lowercase genres and excludes", () => {
    for (let i = 0; i < 300; i++) {
      const parsed = parseQuerySyntax(randomString(rng));
      expect(typeof parsed.text).toBe("string");
      for (const genre of parsed.genres) {
        expect(genre).toBe(genre.toLowerCase());
        expect(genre.length).toBeGreaterThan(0);
      }
      for (const term of parsed.exclude) expect(term.length).toBeGreaterThan(0);
    }
  });

  it("sanitizeQuery respects the length cap and strips control chars", () => {
    for (let i = 0; i < 300; i++) {
      const max = 1 + Math.floor(rng() * 80);
      const clean = sanitizeQuery(randomString(rng, 120), max);
      expect(clean.length).toBeLessThanOrEqual(max);
      expect(/[\u0000-\u001F\u007F\u200B\u200C\u200D]/.test(clean)).toBe(false);
    }
  });

  it("decodeCursor only ever yields null or a positive page", () => {
    for (let i = 0; i < 200; i++) {
      const decoded = decodeCursor(randomString(rng, 24));
      if (decoded !== null) expect(decoded).toBeGreaterThanOrEqual(1);
    }
  });

  it("parseFieldsParam never fabricates unknown fields", () => {
    const allowed = ["title", "image", "score"];
    for (let i = 0; i < 200; i++) {
      const fields = parseFieldsParam(randomString(rng, 40), allowed);
      if (fields) for (const field of fields) expect(allowed).toContain(field);
    }
  });

  it("projectRecord output is a subset of the input keys", () => {
    for (let i = 0; i < 200; i++) {
      const record = { title: "x", image: randomString(rng, 5), score: i };
      const projected = projectRecord(record, ["title", "missing"]) as Record<string, unknown>;
      for (const key of Object.keys(projected)) expect(record).toHaveProperty(key);
    }
  });

  it("fuzzy helpers stay in range and never throw", () => {
    for (let i = 0; i < 300; i++) {
      const score = fuzzyScore(randomString(rng, 20), randomString(rng, 40));
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(() => highlightSegments(randomString(rng, 12), randomString(rng, 30))).not.toThrow();
    }
  });

  it("slug helpers never throw; normalizeSlug only yields safe slugs", () => {
    for (let i = 0; i < 300; i++) {
      const sample = randomString(rng, 60);
      expect(() => animeSlug(sample)).not.toThrow();
      expect(() => endpointSlug(sample, "anime")).not.toThrow();
      const normalized = normalizeSlug(sample);
      if (normalized !== null) expect(normalized).toMatch(/^[a-z0-9][a-z0-9-]{0,159}$/);
    }
  });
});
