import { describe, expect, it } from "vitest";
import { buildCalendarFeed, buildWeeklyReminderIcs } from "@/utils/ics";

describe("buildWeeklyReminderIcs", () => {
  it("emits one VEVENT per anime with weekly recurrence and CRLF endings", () => {
    const ics = buildWeeklyReminderIcs([
      { title: "One Piece", url: "https://kokunime.example/anime/one-piece" },
      { title: "Frieren, Beyond Journey's End; Season 2", url: "https://kokunime.example/anime/frieren-s2" },
    ]);

    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics.match(/RRULE:FREQ=WEEKLY;COUNT=26/g)).toHaveLength(2);
    // Comma and semicolon escaped per RFC 5545.
    expect(ics).toContain("SUMMARY:Cek update Frieren\\, Beyond Journey's End\\; Season 2");
    expect(ics).not.toMatch(/[^\r]\n/); // every newline is a CRLF
  });

  it("keeps UID stable for the same URL", () => {
    const one = buildWeeklyReminderIcs([{ title: "A", url: "https://example.com/a" }], 1);
    const two = buildWeeklyReminderIcs([{ title: "B", url: "https://example.com/a" }], 2);
    const uid = one.match(/UID:([^\r]+)/)?.[1];
    expect(uid).toBeTruthy();
    expect(two).toContain(`UID:${uid}`);
  });

  it("returns a valid empty calendar for no events", () => {
    const ics = buildWeeklyReminderIcs([]);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).not.toContain("BEGIN:VEVENT");
  });
});

describe("buildCalendarFeed", () => {
  const day = new Date(Date.UTC(2026, 9, 18, 12, 0, 0));

  it("emits one all-day VEVENT per title with subscription headers", () => {
    const ics = buildCalendarFeed(
      [
        { title: "One Piece", url: "https://kokunime.example/anime/one-piece", description: "Diperbarui Ep 1120" },
        { title: "Frieren, Beyond Journey's End; Season 2", url: "https://kokunime.example/anime/frieren-s2" },
      ],
      day,
    );

    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("X-WR-CALNAME:Kokunime Update Terbaru");
    expect(ics).toContain("REFRESH-INTERVAL;VALUE=DURATION:PT6H");
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics.match(/DTSTART;VALUE=DATE:20261018/g)).toHaveLength(2);
    expect(ics.match(/DURATION:P1D/g)).toHaveLength(2);
    expect(ics).toContain("SUMMARY:Frieren\\, Beyond Journey's End\\; Season 2");
    // Missing description falls back to the URL; escaping keeps the feed parseable.
    expect(ics).toContain("DESCRIPTION:https://kokunime.example/anime/frieren-s2");
    expect(ics).not.toMatch(/[^\r]\n/); // every newline is a CRLF
  });

  it("keeps UID stable across refreshes so calendars update in place", () => {
    const one = buildCalendarFeed([{ title: "A", url: "https://example.com/a" }], day);
    const two = buildCalendarFeed([{ title: "B", url: "https://example.com/a" }], new Date(Date.UTC(2026, 9, 19)));
    const uid = one.match(/UID:([^\r]+)/)?.[1];
    expect(uid).toBeTruthy();
    expect(two).toContain(`UID:${uid}`);
  });

  it("returns a valid empty calendar for no events", () => {
    const ics = buildCalendarFeed([], day);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).not.toContain("BEGIN:VEVENT");
  });
});
