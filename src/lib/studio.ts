import { sanitizeQuery } from "@/services/scraper/sanitize";

// Studio names arrive percent-encoded in the URL. Shared by the page and its
// RSS mirror so both resolve the same query.
export const decodeStudioName = (raw: string): string => {
  try {
    return sanitizeQuery(decodeURIComponent(raw).trim(), 80);
  } catch {
    return sanitizeQuery(raw.trim(), 80);
  }
};
