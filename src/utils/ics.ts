export interface CalendarEvent {
  title: string;
  url: string;
}

const escapeIcs = (value: string): string =>
  value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// RFC 5545: physical lines ≤75 octets, continuation lines start with a space.
const foldLine = (line: string): string => {
  const chunks: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    chunks.push(rest.slice(0, 74));
    rest = rest.slice(74);
  }
  chunks.push(rest);
  return chunks.join("\r\n ");
};

const djb2 = (value: string): string => {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) hash = ((hash << 5) + hash + value.charCodeAt(i)) >>> 0;
  return hash.toString(16);
};

const formatUtc = (date: Date): string =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

// Weekly "check for updates" reminders — no real air-date data exists upstream,
// so each event is an honest recurring nudge: next Sunday 09:00 WIB (02:00 UTC),
// 26 occurrences, linking to the page where new episodes appear.
export const buildWeeklyReminderIcs = (events: CalendarEvent[], count = 26): string => {
  const start = new Date();
  start.setUTCDate(start.getUTCDate() + ((7 - start.getUTCDay()) % 7 || 7));
  start.setUTCHours(2, 0, 0, 0);
  const dtStart = formatUtc(start);
  const dtStamp = formatUtc(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kokunime//Update Reminder//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:kokunime-${djb2(event.url)}@kokunime`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      "DURATION:PT30M",
      `RRULE:FREQ=WEEKLY;COUNT=${count}`,
      `SUMMARY:${escapeIcs(`Cek update ${event.title}`)}`,
      `DESCRIPTION:${escapeIcs(`Cek episode baru: ${event.url}`)}`,
      `URL:${event.url}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
};
