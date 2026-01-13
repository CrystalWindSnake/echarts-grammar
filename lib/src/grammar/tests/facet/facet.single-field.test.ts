import { describe, it, expect } from "vitest";
import { compileOption } from "@/grammar/api/compile-option";
import { GrammarConfig } from "@/grammar/core/types";

describe("facet - single field column facet with matrix + transform dataset", () => {
  it("should generate matrix cells and transform datasets", () => {
    const data = [
      { region: "A", x: "foo", y: 1 },
      { region: "A", x: "bar", y: 2 },
      { region: "B", x: "foo", y: 3 },
    ];
    const config: GrammarConfig = {
      data: { type: "object-array", data },
      facet: { row: "region" },
      marks: [{ type: "bar", x: "x", y: "y" }],
    };

    const option = compileOption(config);

    expect(option.matrix).toBeDefined();

    const matrix = option.matrix;
    expect(matrix.x.data.length).toBe(2); // A, B

    // raw + 2 transform datasets
    expect(option.dataset.length).toBe(3);

    const rawDs = option.dataset[0];
    expect(rawDs.source.length).toBe(3);

    const transformDs = option.dataset.slice(1);
    for (const ds of transformDs) {
      expect(ds.transform.type).toBe("filter");
      expect(ds.fromDatasetId).toBe(rawDs.id);
    }

    expect(option.series.length).toBe(2);

    option.series.forEach((s: any) => {
      expect(typeof s.datasetId).toBe("string");
      expect(s.encode).toEqual({ x: "x", y: "y" });
    });
  });
});
