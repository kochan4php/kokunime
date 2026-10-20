import { DownloadOption } from "@/interfaces";
import { parseEpisodeRange } from "@/services/scraper/sanitize";
import { parseTotalEpisodes } from "@/utils/progress";

interface EpisodeCoverage {
  total?: number | undefined;
  available: number[];
  missing: number[];
  // False when a download group has no parseable range (e.g. a plain "Batch"
  // title), because we cannot know which episodes it covers.
  verifiable: boolean;
}

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

// Compares the episode total from metadata with every range the page exposes.
// "missing" means "not detected on this page", not "definitely lost upstream".
export const analyzeEpisodeCoverage = (
  downloads: DownloadOption[] | undefined,
  totalRaw?: string | null,
): EpisodeCoverage => {
  const total = parseTotalEpisodes(totalRaw);
  const available = listEpisodeNumbers(downloads);
  const groups = downloads ?? [];
  const covered = new Set<number>();
  let verifiable = groups.length > 0;

  for (const group of groups) {
    const range = parseEpisodeRange(group.title);
    const start = range.start;
    const end = range.end;
    if (!start || !end || end < start) {
      verifiable = false;
      continue;
    }
    for (let episode = start; episode <= end; episode++) {
      covered.add(episode);
    }
  }

  if (!total || !verifiable) return { total, available, missing: [], verifiable: false };

  const missing: number[] = [];
  for (let episode = 1; episode <= total; episode++) {
    if (!covered.has(episode)) missing.push(episode);
  }
  return { total, available, missing, verifiable: true };
};

// Compact display for a list of episode numbers: [3,4,5,9] -> "3–5, 9".
export const formatEpisodeRanges = (numbers: number[]): string => {
  if (numbers.length === 0) return "";
  const sorted = [...new Set(numbers)].sort((a, b) => a - b);
  const first = sorted[0];
  if (first === undefined) return "";
  const parts: string[] = [];
  let start = first;
  let end = first;

  const flush = (): void => {
    parts.push(start === end ? String(start) : `${start}–${end}`);
  };

  for (let index = 1; index < sorted.length; index++) {
    const current = sorted[index];
    if (current === undefined) continue;
    if (current === end + 1) {
      end = current;
      continue;
    }
    flush();
    start = current;
    end = current;
  }
  flush();
  return parts.join(", ");
};
