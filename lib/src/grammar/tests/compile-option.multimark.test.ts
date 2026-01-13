import { describe, it, expect } from "vitest";
import { compileOption } from "@/grammar/api/compile-option";
import { GrammarConfig } from "@/grammar/core/types";

describe("compileOption - multiple marks share dataset", () => {
  it("should reuse dataset for multiple marks", () => {
    const dataSource = {
      type: "object-array" as const,
      data: [
        { x: "foo", y: 1 },
        { x: "bar", y: 2 },
      ],
    };

    const config: GrammarConfig = {
      data: dataSource,
      marks: [
        { type: "bar", x: "x", y: "y" },
        { type: "line", x: "x", y: "y" },
      ],
    };

    const option = compileOption(config);

    expect(option.dataset.length).toBe(1);
    expect(option.series.length).toBe(2);

    const dsId = option.dataset[0].id;
    expect(option.series[0].datasetId).toBe(dsId);
    expect(option.series[1].datasetId).toBe(dsId);
  });
});
