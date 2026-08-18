/**
 * Formats decimal score strings to Indonesian locale standards (comma decimal separator).
 * Examples:
 *   "8.45" -> "8,45"
 *   "9.0"  -> "9,00"
 *   "N/A"  -> "N/A"
 */
export function formatScoreIndonesian(score?: string | null): string {
  if (!score) return "N/A";
  const trimmed = score.trim();
  const num = parseFloat(trimmed);
  if (isNaN(num)) return trimmed;
  return num.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Formats integers to Indonesian localized thousands separator (dot).
 * Examples:
 *   1500 -> "1.500"
 *   1250000 -> "1.250.000"
 */
export function formatNumberIndonesian(value: number): string {
  return value.toLocaleString("id-ID");
}
