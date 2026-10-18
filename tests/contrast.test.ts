import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";

// Contrast gate: parses the design tokens and enforces WCAG 1.4.3 (text ≥ 4.5:1)
// and 1.4.11 (UI edges ≥ 3:1) for every accent variant. A token change that
// drops body text or a sticker label below AA fails the suite.

const css = readFileSync(new URL("../src/app/styles/tokens.css", import.meta.url), "utf8");

type Tokens = Record<string, string>;

const parseDeclarations = (block: string, prefix: string): Tokens => {
  const tokens: Tokens = {};
  for (const match of block.matchAll(new RegExp(`(${prefix}[\\w-]+):\\s*([^;]+);`, "g"))) {
    const [, name, raw] = match;
    const value = (raw ?? "").trim();
    if (name && /^#[0-9a-f]{3,8}$/i.test(value)) tokens[name] = value;
  }
  return tokens;
};

// var() indirection resolves against the same theme (e.g. --color-ink → --ink).
const resolve = (tokens: Tokens, value: string | undefined): string | null => {
  if (!value) return null;
  const reference = /^var\((--[\w-]+)\)$/.exec(value);
  if (reference) return tokens[reference[1] ?? ""] ?? null;
  return /^#[0-9a-f]{3,8}$/i.test(value) ? value : null;
};

const baseBlock = /(?:^|\n):root\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
const themeBlock = /@theme inline\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";

const light: Tokens = {
  ...parseDeclarations(baseBlock, "--"),
  ...Object.fromEntries(
    Object.entries(parseDeclarations(themeBlock, "--color-")).map(([name, value]) => [
      name.replace("--color-", "--"),
      value,
    ]),
  ),
};

const accentVariants = [...css.matchAll(/:root\[data-accent="([^"]+)"\]\s*\{([^}]*)\}/g)].map((match) => ({
  name: match[1] ?? "?",
  overrides: parseDeclarations(match[2] ?? "", "--"),
}));

// Dark theme: the base block inherits the light tokens and overrides colours,
// so every pair below is checked against the merged result.
const darkBlock = /:root\[data-theme="dark"\]\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
const dark: Tokens = { ...light, ...parseDeclarations(darkBlock, "--") };
const darkAccentVariants = [...css.matchAll(/:root\[data-theme="dark"\]\[data-accent="([^"]+)"\]\s*\{([^}]*)\}/g)].map(
  (match) => ({
    name: match[1] ?? "?",
    overrides: parseDeclarations(match[2] ?? "", "--"),
  }),
);

const relativeLuminance = (hex: string): number => {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? [...value].map((c) => c + c).join("") : value.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((offset) => Number.parseInt(full.slice(offset, offset + 2), 16) / 255);
  const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channel(r ?? 0) + 0.7152 * channel(g ?? 0) + 0.0722 * channel(b ?? 0);
};

const contrast = (tokens: Tokens, foreground: string, background: string): number | null => {
  const fg = resolve(tokens, tokens[foreground]);
  const bg = resolve(tokens, tokens[background]);
  if (!fg || !bg) return null;
  const first = relativeLuminance(fg);
  const second = relativeLuminance(bg);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
};

// Text pairs (4.5:1): body copy, muted meta, links, and every sticker label.
const TEXT_PAIRS: [string, string][] = [
  ["--ink", "--bg"],
  ["--ink", "--surface"],
  ["--ink", "--surface-muted"],
  ["--ink-muted", "--bg"],
  ["--ink-muted", "--surface"],
  ["--ink-muted", "--surface-muted"],
  ["--accent-text", "--surface"],
  ["--accent-text", "--bg"],
  ["--accent-ink", "--accent"],
  ["--accent-ink", "--accent-strong"],
  ["--accent-ink", "--accent-2"],
  ["--nb-ink", "--nb-yellow"],
  ["--nb-ink", "--nb-pink"],
  ["--nb-ink", "--nb-teal"],
  ["--nb-ink", "--nb-lime"],
  ["--nb-ink", "--nb-purple"],
  ["--nb-ink", "--nb-orange"],
  ["--nb-ink", "--nb-red"],
];

// UI edges (3:1): card borders and hard shadows must stay legible.
const UI_PAIRS: [string, string][] = [
  ["--border", "--bg"],
  ["--border", "--surface"],
  ["--border", "--surface-muted"],
];

describe("token contrast (light theme)", () => {
  it("parses the palette it intends to guard", () => {
    expect(light["--ink"]).toBeTruthy();
    expect(light["--surface-muted"]).toBeTruthy();
    expect(light["--nb-yellow"]).toBeTruthy();
    expect(Object.keys(light).length).toBeGreaterThan(15);
    expect(accentVariants.length).toBeGreaterThanOrEqual(3);
  });

  it.each(TEXT_PAIRS)("text %s on %s meets AA (4.5:1)", (foreground, background) => {
    const ratio = contrast(light, foreground, background);
    expect(ratio, `${foreground} on ${background} — token missing?`).not.toBeNull();
    expect(ratio ?? 0).toBeGreaterThanOrEqual(4.5);
  });

  it.each(UI_PAIRS)("edge %s on %s meets 3:1", (foreground, background) => {
    const ratio = contrast(light, foreground, background);
    expect(ratio ?? 0).toBeGreaterThanOrEqual(3);
  });

  it.each(accentVariants.map((variant) => variant.name))("accent variant %s keeps text legible", (name) => {
    const variant = accentVariants.find((entry) => entry.name === name);
    const tokens = { ...light, ...variant?.overrides };
    expect(contrast(tokens, "--accent-text", "--surface") ?? 0).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens, "--accent-ink", "--accent") ?? 0).toBeGreaterThanOrEqual(4.5);
    // Hover fills use the light tint (--accent-2); --accent-strong is only
    // ever painted behind non-text decoration (scrollbar thumb).
    expect(contrast(tokens, "--accent-ink", "--accent-2") ?? 0).toBeGreaterThanOrEqual(4.5);
  });
});

describe("token contrast (dark theme)", () => {
  it("parses a dark palette that overrides every colour surface", () => {
    const darkTokens = parseDeclarations(darkBlock, "--");
    for (const token of [
      "--bg",
      "--surface",
      "--surface-solid",
      "--surface-muted",
      "--border",
      "--ink",
      "--ink-muted",
      "--accent",
      "--accent-text",
      "--accent-2",
    ]) {
      expect(darkTokens[token], `${token} missing from :root[data-theme="dark"]`).toBeTruthy();
    }
    // Every accent must get a dark tuning, or text on dark paper silently fails.
    expect(darkAccentVariants.map((variant) => variant.name).sort()).toEqual(
      accentVariants.map((variant) => variant.name).sort(),
    );
  });

  it.each(TEXT_PAIRS)("text %s on %s meets AA (4.5:1)", (foreground, background) => {
    const ratio = contrast(dark, foreground, background);
    expect(ratio, `${foreground} on ${background} (dark) — token missing?`).not.toBeNull();
    expect(ratio ?? 0).toBeGreaterThanOrEqual(4.5);
  });

  it.each(UI_PAIRS)("edge %s on %s meets 3:1", (foreground, background) => {
    const ratio = contrast(dark, foreground, background);
    expect(ratio ?? 0).toBeGreaterThanOrEqual(3);
  });

  it.each(darkAccentVariants.map((variant) => variant.name))("dark accent %s keeps text legible", (name) => {
    const variant = darkAccentVariants.find((entry) => entry.name === name);
    const tokens = { ...dark, ...variant?.overrides };
    expect(contrast(tokens, "--accent-text", "--surface") ?? 0).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens, "--accent-text", "--bg") ?? 0).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens, "--accent-ink", "--accent") ?? 0).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens, "--accent-ink", "--accent-2") ?? 0).toBeGreaterThanOrEqual(4.5);
  });
});
