// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addTag,
  clearTags,
  deleteTag,
  getSlugsForTag,
  getTagsForSlug,
  getTagsVersion,
  listTags,
  normalizeTag,
  removeTag,
  renameTag,
} from "@/utils/tags";

beforeEach(() => {
  clearTags();
  window.localStorage.clear();
  window.dispatchEvent(new Event("storage"));
});

describe("normalizeTag", () => {
  it("strips hashes, collapses spaces, lowercases and caps the length", () => {
    expect(normalizeTag("  ##Favorit   Istri ")).toBe("favorit istri");
    expect(normalizeTag("x".repeat(40))).toHaveLength(24);
    expect(normalizeTag("   ")).toBe("");
  });
});

describe("tag store", () => {
  it("adds tags per slug without duplicating", () => {
    expect(addTag("naruto", "rewatch")).toBe(true);
    expect(addTag("naruto", "ReWatch")).toBe(false);
    expect(addTag("naruto", "favorit")).toBe(true);
    expect(getTagsForSlug("naruto")).toEqual(["favorit", "rewatch"]);
    expect(getSlugsForTag("rewatch")).toEqual(["naruto"]);
    expect(listTags().map((entry) => [entry.tag, entry.count])).toEqual([
      ["favorit", 1],
      ["rewatch", 1],
    ]);
  });

  it("bumps the version on every mutation so components re-render", () => {
    const before = getTagsVersion();
    addTag("bleach", "rewatch");
    expect(getTagsVersion()).toBe(before + 1);
    removeTag("bleach", "rewatch");
    expect(getTagsVersion()).toBe(before + 2);
  });

  it("removes a slug and drops the tag when it becomes empty", () => {
    addTag("naruto", "rewatch");
    addTag("bleach", "rewatch");
    expect(removeTag("naruto", "rewatch")).toBe(true);
    expect(getSlugsForTag("rewatch")).toEqual(["bleach"]);
    expect(removeTag("bleach", "rewatch")).toBe(true);
    expect(listTags()).toEqual([]);
    expect(removeTag("bleach", "rewatch")).toBe(false);
  });

  it("renames a tag and merges onto an existing name", () => {
    addTag("naruto", "rewatch");
    addTag("bleach", "rewatch");
    addTag("bleach", "favorit");
    expect(renameTag("rewatch", "favorit")).toBe(true);
    expect(getSlugsForTag("favorit").sort()).toEqual(["bleach", "naruto"]);
    expect(getSlugsForTag("rewatch")).toEqual([]);
    expect(listTags()).toHaveLength(1);
    expect(renameTag("favorit", "favorit")).toBe(false);
    expect(renameTag("missing", "apa")).toBe(false);
  });

  it("deletes a tag and persists across a reload", async () => {
    addTag("naruto", "rewatch");
    addTag("naruto", "favorit");
    expect(deleteTag("rewatch")).toBe(true);
    expect(deleteTag("rewatch")).toBe(false);

    vi.resetModules();
    const fresh = await import("@/utils/tags");
    expect(fresh.getTagsForSlug("naruto")).toEqual(["favorit"]);
  });
});
