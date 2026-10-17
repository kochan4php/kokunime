import { describe, expect, it } from "vitest";
import { buildWeeklyReminderIcs } from "@/utils/ics";

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
