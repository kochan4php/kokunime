import { DownloadOption } from "@/interfaces";
import { parseEpisodeRange } from "@/services/scraper/sanitize";

// Ascending list of single-episode group numbers in a detail page's download
// options. Batch groups and "Episode 01-12" ranges are not one episode.
export const listEpisodeNumbers = (downloads?: DownloadOption[]): number[] => {
  const numbers = new Set<number>();
  for (const group of downloads ?? []) {
    if (group.is_batch) continue;
    const range = parseEpisodeRange(group.title);
    if (range.total === 1 && range.start) numbers.add(range.start);
  }
  return [...numbers].sort((a, b) => a - b);
};
