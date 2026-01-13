import { describe, it, expect } from "vitest";
import { compileOption } from "@/grammar/api/compile-option";
import { GrammarConfig } from "@/grammar/core/types";

describe("facet - multi field matrix facet", () => {
  it("should generate dataset for each combination", () => {
    const data = [
      { region: "A", year: 2023, x: "foo", y: 1 },
      { region: "A", year: 2024, x: "foo", y: 2 },
      { region: "B", year: 2023, x: "foo", y: 3 },
    ];
    const config: GrammarConfig = {
      data: { type: "object-array", data },
      facet: { row: "region", col: "year" },
      marks: [{ type: "line", x: "x", y: "y" }],
    };

    const option = compileOption(config);

    // combinations: (A,2023) (A,2024) (B,2023)
    expect(option.dataset.length).toBe(1 + 3);
    expect(option.series.length).toBe(3);
    expect(option.matrix.x.data).toEqual(["2023", "2024"]);
    expect(option.matrix.y.data).toEqual(["A", "B"]);

    option.series.forEach((s: any) => {
      expect(s.type).toBe("line");
    });
  });
});
