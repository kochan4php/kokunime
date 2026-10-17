import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string): string => readFileSync(path, "utf8");

describe("error pages never leak internals", () => {
  const displayed = [
    "src/components/route-error.tsx",
    "src/app/error.tsx",
    "src/app/global-error.tsx",
    "src/app/not-found.tsx",
    "src/components/error-card.tsx",
  ];

  it("render fixed copy — no stack traces or raw messages in the DOM", () => {
    for (const file of displayed) {
      const source = read(file);
      expect(source, file).not.toContain("error.stack");
      expect(source, file).not.toMatch(/\{error\??\.message\}/);
      expect(source, file).not.toContain("dangerouslySetInnerHTML");
    }
  });

  it("route error reports only the digest + message to the logger endpoint", () => {
    const source = read("src/components/route-error.tsx");
    expect(source).toContain("digest: error?.digest");
    expect(source).toContain('message: error?.message || "Unknown client error"');
  });
});
