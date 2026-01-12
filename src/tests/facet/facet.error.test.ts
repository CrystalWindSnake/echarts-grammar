import { describe, it, expect } from "vitest";
import { compileOption } from "@/api/compile-option";
import { GrammarConfig } from "@/core/types";

describe("facet - error handling", () => {
  it("should throw when facet is set but no data provided", () => {
    const config: GrammarConfig = {
      facet: { by: "region" },
      marks: [{ type: "bar", x: "x", y: "y" }],
    } as any;
    expect(() => compileOption(config)).toThrow("facet requires global data");
  });
});
