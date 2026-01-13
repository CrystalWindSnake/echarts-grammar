import { describe, it, expect } from "vitest";
import { compileOption } from "@/grammar/api/compile-option";
import { GrammarConfig } from "@/grammar/core/types";

describe("compileOption - basic single mark", () => {
  it("should generate dataset, axis and series correctly", () => {
    const config: GrammarConfig = {
      data: {
        type: "object-array",
        data: [
          { x: "foo", y: 1 },
          { x: "bar", y: 2 },
        ],
      },
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
        },
      ],
    };

    const option = compileOption(config);

    expect(option.dataset.length).toBe(1);
    expect(option.series.length).toBe(1);
    expect(option.xAxis.length).toBe(1);
    expect(option.yAxis.length).toBe(1);

    const ds = option.dataset[0];
    expect(ds.dimensions).toEqual(["x", "y"]);
    expect(ds.source).toEqual([
      ["foo", 1],
      ["bar", 2],
    ]);

    const series = option.series[0];
    expect(series.type).toBe("bar");
    expect(series.encode).toEqual({ x: "x", y: "y" });
    expect(series.datasetId).toBe(ds.id);
  });
});
