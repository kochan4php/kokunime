/**
 * Formats dates into localized Indonesian or English formats.
 * e.g. "19 Agustus 2026" or "19 August 2026".
 */
export function formatLocalizedDate(dateInput?: string | Date | number | null, locale: "id" | "en" = "id"): string {
  if (!dateInput) return "";
  if (typeof dateInput === "string") {
    if (/^(spring|summer|fall|autumn|winter)\s+\d{4}$/i.test(dateInput.trim())) {
      return dateInput.trim();
    }
  }
  const d = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    return String(dateInput).trim();
  }
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
