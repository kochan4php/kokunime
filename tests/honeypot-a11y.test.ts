// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import axe from "axe-core";
import { HoneypotTrap } from "@/components/honeypot-trap";

describe("HoneypotTrap accessibility", () => {
  const html = renderToStaticMarkup(createElement(HoneypotTrap));

  it("is hidden from assistive tech and skipped by keyboard tab order", () => {
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('tabindex="-1"');
  });

  it("adds no axe violations (hidden anchor must not trip aria-hidden rules)", async () => {
    document.body.innerHTML = `<main>${html}</main>`;
    const results = await axe.run(document.body);
    expect(results.violations).toEqual([]);
  });
});
