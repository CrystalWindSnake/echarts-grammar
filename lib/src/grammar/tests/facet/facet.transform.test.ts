import { describe, it, expect } from "vitest";
import { compileOption } from "@/grammar/api/compile-option";
import { GrammarConfig } from "@/grammar/core/types";

describe("facet - dataset transform correctness", () => {
  it("transform dataset should filter correctly by dimension", () => {
    const data = [
      { region: "A", x: "foo", y: 1 },
      { region: "B", x: "foo", y: 2 },
    ];
    const config: GrammarConfig = {
      data: { type: "object-array", data },
      facet: { row: "region" },
      marks: [{ type: "bar", x: "x", y: "y" }],
    };

    const option = compileOption(config);

    const transformDs = option.dataset[1];

    expect(transformDs.transform).toEqual({
      type: "filter",
      config: {
        and: [
          {
            "=": "A",
            dimension: "region",
          },
        ],
      },
    });
  });
});
