import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProseSkeleton, SectionHeaderSkeleton } from "@/components/skeletons/skeleton-primitives";
import HomeSkeleton from "@/sections/home-skeleton";
import ListingSkeleton from "@/sections/listing-skeleton";

const occurrences = (html: string, token: string): number => html.split(token).length - 1;

describe("shared skeleton shells", () => {
  it("renders the section header controls, badge and rule", () => {
    const html = renderToStaticMarkup(
      createElement(SectionHeaderSkeleton, {
        badge: true,
        aside: createElement("div", { className: "control" }, "action"),
      }),
    );

    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain(">action<");
    expect(occurrences(html, "skeleton")).toBeGreaterThanOrEqual(8);
  });

  it("adds breadcrumb and pagination only when a listing asks for them", () => {
    const bare = renderToStaticMarkup(createElement(ListingSkeleton));
    const full = renderToStaticMarkup(createElement(ListingSkeleton, { breadcrumb: true, pagination: true }));

    expect(bare).toContain('aria-label="Memuat daftar anime"');
    expect(full).toContain("container px-4 pt-4");
    expect(occurrences(full, "skeleton")).toBeGreaterThan(occurrences(bare, "skeleton"));
    expect(occurrences(full, "h-10 w-10")).toBe(5);
  });

  it("keeps the home hero, listing and recommendation blocks together", () => {
    const html = renderToStaticMarkup(createElement(HomeSkeleton));

    expect(html).toContain("Memuat unggulan");
    expect(html).toContain("Memuat daftar anime");
    expect(html).toContain("Memuat halaman");
  });

  it("renders one prose panel per requested legal section", () => {
    const html = renderToStaticMarkup(createElement(ProseSkeleton, { sections: 2 }));

    expect(occurrences(html, "shadow-[2px_2px_0_0_var(--border)]")).toBe(2);
  });

  it("keeps a route-level loading boundary next to every page", () => {
    const appDir = path.resolve("src/app");
    const routeDirs: string[] = [];

    const walk = (dir: string): void => {
      if (fs.existsSync(path.join(dir, "page.tsx"))) routeDirs.push(dir);
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) walk(path.join(dir, entry.name));
      }
    };
    walk(appDir);

    // /offline is the service-worker fallback and must paint without a shell.
    const missing = routeDirs
      .filter((dir) => path.relative(appDir, dir) !== "offline")
      .filter((dir) => !fs.existsSync(path.join(dir, "loading.tsx")));

    expect(missing).toEqual([]);
  });
});
