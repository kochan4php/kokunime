// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import axe from "axe-core";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
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

import MainLayout from "@/layouts/main-layout";
import CardAnime from "@/components/cards/card-anime";
import AnimeListing from "@/sections/anime-listing";
import ErrorCard from "@/components/error-card";
import Footer from "@/components/footer";

// jsdom has no layout/paint, so axe cannot evaluate color-contrast/target-size.
// Everything structural (landmarks, names, alt text, labelling, heading order)
// is still checked here.
const runAxe = async (html: string): Promise<string[]> => {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  return results.violations.map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length} nodes)`);
};

describe("axe accessibility audit", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.title = "Kokunime";
    document.documentElement.lang = "id";
  });

  it("page chrome + anime card grid has no axe violations", async () => {
    const markup = renderToStaticMarkup(
      createElement(
        MainLayout,
        null,
        createElement(
          "section",
          { className: "container" },
          createElement("h1", null, "Anime Terbaru"),
          createElement("h2", null, "Rilisan Minggu Ini"),
          createElement(
            "div",
            null,
            createElement(CardAnime, {
              path: "/anime/one-piece-sub-indo",
              src: "https://img.example/one-piece.jpg",
              title: "One Piece",
              meta: "Ongoing",
              genres: ["Action", "Adventure"],
              eager: true,
              priority: false,
            }),
            createElement(CardAnime, {
              path: "/anime/frieren-sub-indo",
              src: "https://img.example/frieren.jpg",
              title: "Frieren",
              meta: "Tamat",
              genres: ["Fantasy"],
            }),
          ),
        ),
      ),
    );

    expect(await runAxe(markup)).toEqual([]);
  });

  it("error card + footer has no axe violations", async () => {
    const markup = renderToStaticMarkup(
      createElement(
        "div",
        null,
        // ErrorCard brings its own <main id="konten"> — do not add another one.
        createElement(
          ErrorCard,
          { code: "500", label: "Ada yang salah", title: "Terjadi kesalahan", message: "Coba lagi nanti." },
          createElement("button", { type: "button" }, "Muat ulang"),
        ),
        createElement(Footer),
      ),
    );

    expect(await runAxe(markup)).toEqual([]);
  });

  it("listing page with filter + pagination has no axe violations", async () => {
    const markup = renderToStaticMarkup(
      createElement(AnimeListing, {
        chip: "Genre",
        title: "Action",
        anime: [
          {
            title: "One Piece",
            release: "Ongoing",
            genres: ["Action"],
            link: { endpoint: "one-piece/", image: "https://img.example/op.jpg" },
          },
          {
            title: "Naruto",
            release: "Tamat",
            genres: ["Action", "Adventure"],
            link: { endpoint: "naruto/", image: "https://img.example/naruto.jpg" },
          },
        ],
        pagination: {
          first_page_endpoint: "genres/action/",
          next_page_endpoint: "genres/action/page/2/",
          current_page: 1,
          pages_of: "10",
          total_page: 10,
          prev_page_endpoint: null,
          last_page_endpoint: "genres/action/page/10/",
        },
        eagerCount: 2,
      }),
    );

    expect(await runAxe(markup)).toEqual([]);
  });
});
