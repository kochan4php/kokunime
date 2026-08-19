const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Formats dates into localized Indonesian or English formats.
 * e.g. "19 Agustus 2026" or "19 August 2026".
 */
export function formatLocalizedDate(
  dateInput?: string | Date | number | null,
  locale: "id" | "en" = "id",
): string {
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
  const day = d.getDate();
  const monthList = locale === "id" ? MONTHS_ID : MONTHS_EN;
  const month = monthList[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}
