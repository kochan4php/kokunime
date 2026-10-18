import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { qrEncode, qrSvgPath } from "@/utils/qr";

const TEXT = "https://kokunime.netlify.app/anime/dropsofgod-batch-subtitle-indonesia-1";

describe("qrEncode structure", () => {
  it("produces a matrix of the correct size for the payload", () => {
    const matrix = qrEncode(TEXT);
    expect(matrix).not.toBeNull();
    const size = matrix?.length ?? 0;
    expect((size - 17) % 4).toBe(0);
    expect(matrix?.every((row) => row.length === size)).toBe(true);
  });

  it("returns null when the payload exceeds version 10", () => {
    expect(qrEncode("a".repeat(214))).toBeNull();
    expect(qrEncode("a".repeat(213))).not.toBeNull();
  });

  it("draws the three finder patterns and alternating timing tracks", () => {
    const matrix = qrEncode(TEXT, { mask: 0 });
    if (!matrix) throw new Error("no matrix");
    const size = matrix.length;
    const dark = (x: number, y: number): boolean => matrix[y]?.[x] === true;

    for (const [x0, y0] of [
      [0, 0],
      [size - 7, 0],
      [0, size - 7],
    ] as const) {
      expect(dark(x0 + 3, y0 + 3)).toBe(true);
      expect(dark(x0, y0)).toBe(true);
      expect(dark(x0 + 1, y0 + 1)).toBe(false);
      expect(dark(x0, y0 + 1)).toBe(true);
    }
    for (let i = 8; i < size - 8; i++) {
      expect(dark(i, 6)).toBe(i % 2 === 0);
      expect(dark(6, i)).toBe(i % 2 === 0);
    }
  });

  it("hides the chosen mask in the format information", () => {
    const matrix = qrEncode(TEXT, { mask: 3 });
    if (!matrix) throw new Error("no matrix");
    // Mirrors the writer's layout: bits 0–5 up column 8, then the hop over the
    // timing track (bit 6), the corner (bit 7), and out along row 8 (bits 8–14).
    const bitAt = (i: number): number => {
      const dark = (x: number, y: number): boolean => matrix[y]?.[x] === true;
      if (i <= 5) return dark(8, i) ? 1 : 0;
      if (i === 6) return dark(8, 7) ? 1 : 0;
      if (i === 7) return dark(8, 8) ? 1 : 0;
      if (i === 8) return dark(7, 8) ? 1 : 0;
      return dark(14 - i, 8) ? 1 : 0;
    };
    // ECC level M (00) makes the mask index the low 3 bits of the BCH word.
    const value = Array.from({ length: 15 }, (_, i) => bitAt(i)).reduce((acc, bit, i) => acc | (bit << i), 0);
    expect(((value ^ 0x5412) >> 10) & 0b111).toBe(3);
  });

  it("auto-picks a mask equal to one of the eight forced matrices", () => {
    const auto = qrEncode(TEXT);
    const forced = Array.from({ length: 8 }, (_, mask) => JSON.stringify(qrEncode(TEXT, { mask })));
    expect(forced).toContain(JSON.stringify(auto));
  });
});

describe("qrSvgPath", () => {
  it("merges each horizontal run into one rect and skips light modules", () => {
    const path = qrSvgPath([
      [true, true, false, true],
      [false, false, false, false],
    ]);
    expect(path).toBe("M0 0h2v1h-2zM3 0h1v1h-1z");
  });

  it("covers exactly the dark modules", () => {
    const matrix = qrEncode(TEXT);
    if (!matrix) throw new Error("no matrix");
    const path = qrSvgPath(matrix);
    const rects = [...path.matchAll(/M(\d+) (\d+)h(\d+)v1h-(\d+)z/g)];
    const painted = rects.reduce((sum, match) => sum + Number(match[3]), 0);
    const darkCount = matrix.flat().filter(Boolean).length;
    expect(painted).toBe(darkCount);
    expect(new Set(rects.map((match) => match[2])).size).toBeLessThanOrEqual(matrix.length);
  });
});

// Cross-check against the Python reference encoder. Skipped when python or the
// `qrcode` package is missing (CI-safe): the invariant tests above still run.
const referenceScript = path.join(process.cwd(), "tests", "fixtures", "qr-reference.py");
const pythonAvailable = spawnSync('py -3.13 -c "import qrcode"', { shell: true, encoding: "utf8" }).status === 0;

describe.skipIf(!pythonAvailable)("qrEncode vs python qrcode reference", () => {
  it("matches module-for-module for every mask and payload length", () => {
    const texts = [TEXT, "HELLO WORLD", "x".repeat(120), "a".repeat(200)];
    const cases: { text: string; version: number; mask: number }[] = [];
    for (const text of texts) {
      const sample = qrEncode(text, { mask: 0 });
      if (!sample) throw new Error(`encoder returned null for ${text.length} bytes`);
      const version = (sample.length - 17) / 4;
      for (let mask = 0; mask < 8; mask++) cases.push({ text, version, mask });
    }

    const run = spawnSync(`py -3.13 "${referenceScript}"`, {
      input: JSON.stringify(cases),
      encoding: "utf8",
      shell: true,
      timeout: 60000,
    });
    expect(run.status).toBe(0);
    const matrices = JSON.parse(run.stdout) as number[][][];
    expect(matrices).toHaveLength(cases.length);

    cases.forEach((testCase, index) => {
      const mine = qrEncode(testCase.text, { mask: testCase.mask });
      const theirs = matrices[index] ?? [];
      const label = `${testCase.text.length}B mask=${testCase.mask}`;
      expect(mine?.length, label).toBe(theirs.length);
      mine?.forEach((row, y) => {
        expect(
          row.map((cell) => (cell ? 1 : 0)),
          `${label} row ${y}`,
        ).toEqual(theirs[y]);
      });
    });
  });
});
