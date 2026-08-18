import { describe, expect, it } from "vitest";
import { groupSeasonsByYear, orderYears } from "@/utils/seasons";
import { Season } from "@/interfaces";

describe("groupSeasonsByYear", () => {
  it("groups seasons by 4-digit year extracted from name", () => {
    const seasons: Season[] = [
      { name: "Winter 2024", endpoint: "seasons/winter-2024" },
      { name: "Spring 2024", endpoint: "seasons/spring-2024" },
      { name: "Fall 2023", endpoint: "seasons/fall-2023" },
      { name: "Special OVA", endpoint: "seasons/special-ova" },
    ];

    const grouped = groupSeasonsByYear(seasons);
    expect(grouped["2024"]).toHaveLength(2);
    expect(grouped["2023"]).toHaveLength(1);
    expect(grouped["Lainnya"]).toHaveLength(1);
  });
});

describe("orderYears", () => {
  it("sorts years descending with Lainnya always last", () => {
    const groups = {
      "2022": [],
      "2024": [],
      Lainnya: [],
      "2023": [],
    };

    const ordered = orderYears(groups);
    expect(ordered).toEqual(["2024", "2023", "2022", "Lainnya"]);
  });
});
