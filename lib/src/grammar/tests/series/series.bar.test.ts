import { describe, it, expect } from "vitest";
import { compileOption } from "@/grammar/api/compile-option";
import { GrammarConfig } from "@/grammar/core/types";

describe("series - bar", () => {
  it("should generate single bar series without color", () => {
    const data = [
      { x: "A", y: 10 },
      { x: "B", y: 20 },
    ];

    const config: GrammarConfig = {
      data: { type: "object-array", data },
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
        },
      ],
    };

    const option = compileOption(config);

    expect(option.series).toHaveLength(1);

    const series = option.series[0];

    expect(series.type).toBe("bar");
    expect(typeof series.id).toBe("string");
    expect(typeof series.datasetId).toBe("string");
    expect(typeof series.xAxisId).toBe("string");
    expect(typeof series.yAxisId).toBe("string");

    expect(series.encode).toEqual({
      x: "x",
      y: "y",
    });
  });

  it("should generate multiple bar series when color is specified", () => {
    const data = [
      { x: "A", y: 10, c: "red" },
      { x: "A", y: 20, c: "blue" },
      { x: "B", y: 30, c: "red" },
    ];

    const config: GrammarConfig = {
      data: { type: "object-array", data },
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
          color: "c",
        },
      ],
    };

    const option = compileOption(config);

    // red + blue
    expect(option.series.length).toBe(2);

    const names = option.series.map((s: any) => s.name).sort();
    expect(names).toEqual(["blue", "red"]);

    // raw + 1 duplicated dataset + 2 filtered datasets
    expect(option.dataset.length).toBe(4);

    const rawDataset = option.dataset[1];
    const transformDatasets = option.dataset.slice(2);

    for (const ds of transformDatasets) {
      expect(ds.fromDatasetId).toBe(rawDataset.id);
      expect(ds.transform.type).toBe("filter");
    }

    option.series.forEach((s: any) => {
      expect(s.datasetId).toBeDefined();
      expect(s.encode.x).toBe("x");
      expect(s.encode.y).toBe("y");
    });
  });

  it("should enable label when label is specified", () => {
    const data = [{ x: "A", y: 10 }];

    const config: GrammarConfig = {
      data: { type: "object-array", data },
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
          label: "y",
        },
      ],
    };

    const option = compileOption(config);
    const series = option.series[0];

    expect(series.label).toBeDefined();
    expect(series.label.show).toBe(true);
    expect(series.label.position).toBe("insideTop");

    expect(series.encode.label).toBe("y");
  });

  it("should include tooltip and label in encode when specified", () => {
    const data = [{ x: "A", y: 10 }];

    const config: GrammarConfig = {
      data: { type: "object-array", data },
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
          tooltip: ["x", "y"],
          label: "y",
        },
      ],
    };

    const option = compileOption(config);
    const series = option.series[0];

    expect(series.encode).toEqual({
      x: "x",
      y: "y",
      tooltip: ["x", "y"],
      label: "y",
    });
  });

  it("should merge mark.options into series config", () => {
    const data = [{ x: "A", y: 10 }];

    const config: GrammarConfig = {
      data: { type: "object-array", data },
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
          options: {
            barWidth: 20,
            silent: true,
          },
        },
      ],
    };

    const option = compileOption(config);
    const series = option.series[0];

    expect(series.barWidth).toBe(20);
    expect(series.silent).toBe(true);
  });

  it("should bind series to the same axis id", () => {
    const data = [{ x: "A", y: 10 }];

    const config: GrammarConfig = {
      data: { type: "object-array", data },
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
        },
      ],
    };

    const option = compileOption(config);
    const series = option.series[0];

    expect(series.xAxisId).toBe(series.yAxisId);
  });

  it("should generate different series id for different series", () => {
    const data = [
      { x: "A", y: 10, c: "red" },
      { x: "A", y: 20, c: "blue" },
    ];

    const config: GrammarConfig = {
      data: { type: "object-array", data },
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
          color: "c",
        },
      ],
    };

    const option = compileOption(config);

    expect(option.series.length).toBe(2);

    const [s1, s2] = option.series;
    expect(s1.id).not.toBe(s2.id);
  });
});
