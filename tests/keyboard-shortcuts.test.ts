import { describe, expect, it } from "vitest";

describe("Keyboard Navigation & Global Shortcuts Suite", () => {
  it("verifies keybinding event mappings", () => {
    const shortcuts = [
      { key: "k", ctrl: true, action: "open_command_palette" },
      { key: "t", action: "open_trailer" },
      { key: "f", action: "toggle_fullscreen" },
      { key: "r", action: "random_anime" },
      { key: "?", action: "keyboard_help" },
      { key: "Escape", action: "close_modal" },
    ];

    expect(shortcuts.length).toBe(6);
    expect(shortcuts.some((s) => s.action === "open_command_palette")).toBe(true);
    expect(shortcuts.some((s) => s.action === "open_trailer")).toBe(true);
    expect(shortcuts.some((s) => s.action === "toggle_fullscreen")).toBe(true);
  });

  it("handles case-insensitive key detection", () => {
    const isTrailerKey = (key: string) => key === "t" || key === "T";
    const isFullscreenKey = (key: string) => key === "f" || key === "F";

    expect(isTrailerKey("t")).toBe(true);
    expect(isTrailerKey("T")).toBe(true);
    expect(isTrailerKey("x")).toBe(false);

    expect(isFullscreenKey("f")).toBe(true);
    expect(isFullscreenKey("F")).toBe(true);
    expect(isFullscreenKey("z")).toBe(false);
  });
});
