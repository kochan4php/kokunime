import { DownloadOption } from "@/interfaces";
import {
  buildAria2,
  buildCurlSh,
  buildDetailedText,
  buildDlc,
  buildIdmEf2,
  buildMarkdown,
  collectLinks,
  isLargeBatch,
  safeFilename,
} from "@/utils/download-export";
import { describe, expect, it } from "vitest";

const group: DownloadOption = {
  title: "Episode 1-12 Batch",
  is_batch: true,
  link_download: [
    {
      resolusi: "1080p",
      link: [
        { platform: "Gdrive", url: "https://example.com/a" },
        { platform: "Mega", url: "https://example.com/b", is_torrent: true },
      ],
    },
    { resolusi: "720p", link: [{ platform: "Gdrive", url: undefined }] },
  ],
};

describe("download-export builders", () => {
  it("collects only defined URLs, in order", () => {
    expect(collectLinks(group)).toEqual(["https://example.com/a", "https://example.com/b"]);
  });

  it("slugifies unsafe filenames", () => {
    expect(safeFilename("Jujutsu Kaisen: S2 [BATCH]")).toBe("jujutsu-kaisen-s2-batch");
    expect(safeFilename("---")).toBe("");
  });

  it("flags batches >= 10 GB from resolution labels", () => {
    expect(isLargeBatch(group)).toBe(false);
    expect(isLargeBatch({ ...group, title: "Full Season 24 GB" })).toBe(true);
    expect(isLargeBatch({ ...group, title: "batch 9.9 gb" })).toBe(false);
  });

  it("builds aria2 input lines", () => {
    expect(buildAria2(["https://x/1"])).toBe("https://x/1\n  dir=downloads\n  max-connection-per-server=4");
  });

  it("builds markdown with resolution headers", () => {
    const md = buildMarkdown(group, "Frieren");
    expect(md).toContain("### Frieren - Episode 1-12 Batch");
    expect(md).toContain("**1080p**");
    expect(md).toContain("[Gdrive](https://example.com/a) | [Mega](https://example.com/b)");
  });

  it("builds detailed text with platform lines", () => {
    const text = buildDetailedText(group, "Frieren");
    expect(text).toContain("# Frieren - Episode 1-12 Batch");
    expect(text).toContain("[1080p]");
    expect(text).toContain("Gdrive: https://example.com/a");
    expect(text).not.toContain("undefined");
  });

  it("builds IDM .ef2 entries", () => {
    expect(buildIdmEf2(["https://x/1", "https://x/2"])).toBe("<\nhttps://x/1\n>\n<\nhttps://x/2\n>");
  });

  it("builds a curl script with the anime title", () => {
    const sh = buildCurlSh(["https://x/1"], group, "Frieren");
    expect(sh).toContain("#!/usr/bin/env bash");
    expect(sh).toContain("# Download script for Frieren - Episode 1-12 Batch");
    expect(sh).toContain('curl -L -O -C - "https://x/1"');
  });

  it("builds a DLC container with one file entry per link", () => {
    const dlc = buildDlc(["https://x/1"], "Frieren");
    expect(dlc).toContain('<package name="Frieren">');
    expect(dlc).toContain("<url>https://x/1</url>");
    expect(dlc.trimEnd().endsWith("</dlc>")).toBe(true);
  });
});
