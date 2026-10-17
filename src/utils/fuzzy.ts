// Case-insensitive subsequence match with bonuses for word-starts and
// consecutive hits. 0 = no match, 1..99 = subsequence, 100 = prefix hit.
export const fuzzyScore = (query: string, text: string): number => {
  const q = query.trim().toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 1;
  if (t.startsWith(q)) return 100;
  const found = t.indexOf(q);
  if (found !== -1) return Math.max(60, 100 - found);

  let score = 0;
  let cursor = 0;
  let streak = 0;
  for (const ch of q) {
    const index = t.indexOf(ch, cursor);
    if (index === -1) return 0;
    streak = index === cursor ? streak + 1 : 0;
    score += 6 + (streak > 1 ? 4 : 0);
    if (index === 0 || t[index - 1] === " " || t[index - 1] === "-") score += 6;
    cursor = index + 1;
  }
  return Math.min(59, score);
};

export interface HighlightSegment {
  text: string;
  match: boolean;
}

// Splits text into segments for <mark> rendering: substring match when
// possible, otherwise marks the matched subsequence characters.
export const highlightSegments = (text: string, query: string): HighlightSegment[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [{ text, match: false }];
  const lower = text.toLowerCase();

  const push = (segments: HighlightSegment[], segment: string, match: boolean) => {
    if (!segment) return;
    const last = segments[segments.length - 1];
    if (last && last.match === match) last.text += segment;
    else segments.push({ text: segment, match });
  };

  const direct = lower.indexOf(q);
  if (direct !== -1) {
    const segments: HighlightSegment[] = [];
    push(segments, text.slice(0, direct), false);
    push(segments, text.slice(direct, direct + q.length), true);
    push(segments, text.slice(direct + q.length), false);
    return segments;
  }

  const segments: HighlightSegment[] = [];
  let cursor = 0;
  for (const ch of q) {
    const index = lower.indexOf(ch, cursor);
    if (index === -1) continue;
    push(segments, text.slice(cursor, index), false);
    push(segments, text[index], true);
    cursor = index + 1;
  }
  push(segments, text.slice(cursor), false);
  return segments.length > 0 ? segments : [{ text, match: false }];
};
