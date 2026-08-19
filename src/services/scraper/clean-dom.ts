import { CheerioAPI } from "cheerio";

export function freeCheerioMemory($: CheerioAPI): void {
  try {
    // Remove heavy scripts, comments, styles, iframes from memory tree
    $("script, style, iframe, noscript, svg").remove();
  } catch {}
}
