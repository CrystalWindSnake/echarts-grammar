import { describe, it, expect } from "vitest";
import { compileOption } from "@/api/compile-option";
import { GrammarConfig } from "@/core/types";

describe("facet - dataset transform correctness", () => {
  it("transform dataset should filter correctly by dimension", () => {
    const data = [
      { region: "A", x: "foo", y: 1 },
      { region: "B", x: "foo", y: 2 },
    ];
    const config: GrammarConfig = {
      data: { type: "object-array", data },
      facet: { by: "region" },
      marks: [{ type: "bar", x: "x", y: "y" }],
    };

    const option = compileOption(config);

    const transformDs = option.dataset[1];

    expect(transformDs.transform).toEqual({
      type: "filter",
      config: {
        dimension: "region",
        "=": "A",
      },
    });
  });
});
