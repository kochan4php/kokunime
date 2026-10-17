import { describe, expect, it } from "vitest";
import { analyzeQuery, GRAPHQL_MAX_COMPLEXITY, GRAPHQL_MAX_DEPTH } from "@/lib/graphql-guard";

describe("graphql query guard", () => {
  it("measures nesting depth", () => {
    expect(analyzeQuery('{ anime(slug: "x") { title score } }').depth).toBe(2);
    expect(analyzeQuery("{ a { b { c { d { e } } } } }").depth).toBe(5);
    expect(analyzeQuery("{ a { b { c { d { e { f } } } } } }").depth).toBeGreaterThan(GRAPHQL_MAX_DEPTH);
  });

  it("ignores braces inside string literals", () => {
    const analysis = analyzeQuery('{ anime(slug: "a{b}c") { title } }');
    expect(analysis.depth).toBe(2);
  });

  it("counts field tokens as complexity, skipping reserved words", () => {
    const analysis = analyzeQuery('query { anime(slug: "x") { title score image } }');
    expect(analysis.complexity).toBeGreaterThanOrEqual(5);
    expect(analysis.complexity).toBeLessThan(GRAPHQL_MAX_COMPLEXITY);
  });

  it("flags a field-bomb query above the budget", () => {
    const fields = Array.from({ length: 80 }, (_, index) => `field${index}`).join(" ");
    expect(analyzeQuery(`{ anime { ${fields} } }`).complexity).toBeGreaterThan(GRAPHQL_MAX_COMPLEXITY);
  });
});
