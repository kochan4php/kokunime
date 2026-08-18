/**
 * Decodes common HTML entities and strips excessive whitespace, invisible characters, and HTML artifact tags.
 */
export function cleanText(input?: string | null): string {
  if (!input) return "";

  return input
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#8220;|&#8221;/gi, '"')
    .replace(/&#039;|&apos;|&#8216;|&#8217;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#8211;|&#8212;/gi, "-")
    .replace(/&#8230;/gi, "...")
    .replace(/<[^>]*>/g, "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Sanitizes search queries: strips null-bytes, control chars, trims, and enforces max length (default 80 chars).
 */
export function sanitizeQuery(raw?: string | null, maxLength = 80): string {
  if (!raw) return "";
  return raw
    .replace(/[\0\x00-\x1F\x7F]/g, "")
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/**
 * Parses episode ranges and completion flags from batch title strings.
 * Examples:
 *   "Episode 01 - 12 (End)" -> { start: 1, end: 12, isEnd: true, total: 12 }
 *   "Episode 13-24 END" -> { start: 13, end: 24, isEnd: true, total: 12 }
 *   "Episode 05" -> { start: 5, end: 5, isEnd: false, total: 1 }
 */
export function parseEpisodeRange(title?: string | null): {
  start?: number;
  end?: number;
  isEnd: boolean;
  total?: number;
} {
  if (!title) return { isEnd: false };
  const cleaned = cleanText(title);
  const isEnd = /\b(end|tamat|final)\b/i.test(cleaned);

  const rangeMatch =
    cleaned.match(/episode\s*(\d{1,4})\s*[-–—~]\s*(\d{1,4})/i) || cleaned.match(/\b(\d{1,4})\s*[-–—~]\s*(\d{1,4})\b/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    const total = Math.max(0, end - start + 1);
    return { start, end, isEnd, total };
  }

  const singleMatch = cleaned.match(/episode\s*(\d{1,4})/i);
  if (singleMatch) {
    const ep = parseInt(singleMatch[1], 10);
    return { start: ep, end: ep, isEnd, total: 1 };
  }

  return { isEnd };
}
