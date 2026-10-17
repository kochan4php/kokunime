// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/navigation", () => ({
  usePathname: () => "/anime/episodic-anime",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href?: unknown; children?: ReactNode }) =>
    createElement("a", { href: typeof href === "string" ? href : "#", ...rest }, children),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src?: string; alt?: string }) => createElement("img", { src, alt: alt ?? "" }),
}));

import DownloadSection from "@/components/anime/download-section";
import { AnimeDetail } from "@/interfaces";

const anime = {
  title: "Episodic Anime",
  total_episode: "3",
  download: [
    { title: "Download Episodic Anime Episode 1 Subtitle Indonesia", is_batch: false, link_download: [] },
    { title: "Download Episodic Anime Episode 2 Subtitle Indonesia", is_batch: false, link_download: [] },
    { title: "Download One Piece Episode 01 - 12 Subtitle Indonesia", is_batch: false, link_download: [] },
    { title: "Download Episodic Anime Batch Subtitle Indonesia", is_batch: true, link_download: [] },
  ],
} as unknown as AnimeDetail;

describe("download section anchors (A1/A2/A3 pipeline)", () => {
  it("anchors single-episode groups only, exposes slug meta and the navigator", () => {
    const html = renderToStaticMarkup(createElement(DownloadSection, { anime, slug: "episodic-anime" }));

    expect(html).toContain('id="ep-1"');
    expect(html).toContain('id="ep-2"');
    expect(html).toContain('data-episode-anchor="1"');
    expect(html).toContain('data-anime-slug="episodic-anime"');
    expect(html).toContain("Navigasi Episode");
    // Range groups (01-12) and batch groups never get an anchor.
    expect(html).not.toContain('id="ep-12"');
    expect(html.match(/data-episode-anchor=/g)).toHaveLength(2);
  });

  it("renders no navigator for batch-only pages", () => {
    const batchOnly = {
      title: "Batch Anime",
      download: [{ title: "Download Batch Anime Batch Subtitle Indonesia", is_batch: true, link_download: [] }],
    } as unknown as AnimeDetail;

    const html = renderToStaticMarkup(createElement(DownloadSection, { anime: batchOnly, slug: "batch-anime" }));
    expect(html).not.toContain("data-episode-anchor=");
    expect(html).not.toContain("Navigasi Episode");
  });
});
