import { describe, it, expect } from "vitest";
import { compileOption } from "@/api/compile-option";
import { GrammarConfig } from "@/core/types";

describe("facet - backward compatibility (no facet)", () => {
  it("should not generate matrix when facet is not defined", () => {
    const config: GrammarConfig = {
      data: {
        type: "object-array",
        data: [
          { x: "foo", y: 1 },
          { x: "bar", y: 2 },
        ],
      },
      marks: [{ type: "bar", x: "x", y: "y" }],
    };
    const option = compileOption(config);

    expect(option.matrix).toBeUndefined();
    expect(option.series.length).toBe(1);
    expect(option.dataset.length).toBe(1);
  });
});
