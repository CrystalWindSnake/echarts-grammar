import { describe, it, expect } from "vitest";
import { compileOption } from "@/api/compile-option";
import { GrammarConfig } from "@/core/types";

describe("facet - multi field matrix facet", () => {
  it("should generate dataset for each combination", () => {
    const data = [
      { region: "A", year: 2023, x: "foo", y: 1 },
      { region: "A", year: 2024, x: "foo", y: 2 },
      { region: "B", year: 2023, x: "foo", y: 3 },
    ];
    const config: GrammarConfig = {
      data: { type: "object-array", data },
      facet: { by: ["region", "year"] },
      marks: [{ type: "line", x: "x", y: "y" }],
    };

    const option = compileOption(config);

    // combinations: (A,2023) (A,2024) (B,2023)
    expect(option.dataset.length).toBe(1 + 3);
    expect(option.series.length).toBe(3);
    expect(option.matrix[0].cells.length).toBe(3);

    option.series.forEach((s: any) => {
      expect(s.type).toBe("line");
    });
  });
});
