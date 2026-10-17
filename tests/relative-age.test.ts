import { describe, expect, it } from "vitest";
import { parseRelativeAge } from "@/utils/relative-age";

describe("parseRelativeAge", () => {
  it("buckets upstream's 'Released on H:MM pm' format as today", () => {
    expect(parseRelativeAge("Released on 5:00 pm")).toEqual({ bucket: "today" });
    expect(parseRelativeAge("Released on 12:30 pm")).toEqual({ bucket: "today" });
    expect(parseRelativeAge("Released on 9:30 am")).toEqual({ bucket: "today" });
  });

  it("buckets minute/hour old releases as today", () => {
    expect(parseRelativeAge("12 menit lalu")).toEqual({ minutesAgo: 12, bucket: "today" });
    expect(parseRelativeAge("2 jam lalu")).toEqual({ minutesAgo: 120, bucket: "today" });
    expect(parseRelativeAge("baru saja")).toEqual({ minutesAgo: 0, bucket: "today" });
  });

  it("buckets yesterday, recent and older durations", () => {
    expect(parseRelativeAge("kemarin")).toEqual({ bucket: "yesterday" });
    expect(parseRelativeAge("1 hari lalu")).toEqual({ minutesAgo: 1440, bucket: "yesterday" });
    expect(parseRelativeAge("40 jam lalu")).toEqual({ minutesAgo: 2400, bucket: "yesterday" });
    expect(parseRelativeAge("3 hari lalu")).toEqual({ minutesAgo: 4320, bucket: "recent" });
    expect(parseRelativeAge("2 minggu lalu")).toEqual({ bucket: "older" });
    expect(parseRelativeAge("sebulan lalu")).toEqual({ bucket: "recent" });
  });

  it("returns unknown for empty or unparseable values", () => {
    expect(parseRelativeAge("")).toEqual({ bucket: "unknown" });
    expect(parseRelativeAge(null)).toEqual({ bucket: "unknown" });
    expect(parseRelativeAge("Season 3")).toEqual({ bucket: "unknown" });
  });
});
