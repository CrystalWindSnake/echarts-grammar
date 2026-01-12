import { describe, it, expect } from "vitest";
import { compileOption } from "@/api/compile-option";
import { GrammarConfig } from "@/core/types";

describe("compileOption - datasource formats", () => {
  it("should support matrix datasource with dimensions", () => {
    const config: GrammarConfig = {
      data: {
        type: "matrix",
        dimensions: ["x", "y"],
        data: [
          ["foo", 10],
          ["bar", 20],
        ],
      },
      marks: [{ type: "bar", x: "x", y: "y" }],
    };

    const option = compileOption(config);
    const ds = option.dataset[0];

    expect(ds.dimensions).toEqual(["x", "y"]);
    expect(ds.source).toEqual([
      ["foo", 10],
      ["bar", 20],
    ]);
  });

  it("should allow mark to override global datasource", () => {
    const config: GrammarConfig = {
      data: {
        type: "object-array",
        data: [{ x: "global", y: 0 }],
      },
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
          data: {
            type: "object-array",
            data: [{ x: "local", y: 5 }],
          },
        },
      ],
    };

    const option = compileOption(config);
    const ds = option.dataset[0];

    expect(ds.source).toEqual([["local", 5]]);
  });
});
