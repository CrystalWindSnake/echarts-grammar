import { describe, it, expect } from "vitest";
import { compileOption } from "@/api/compile-option";
import { GrammarConfig } from "@/core/types";

describe("compileOption - error cases", () => {
  it("should throw if no marks provided", () => {
    const config = { marks: [] } as any;

    expect(() => compileOption(config)).toThrow();
  });

  it("should throw if no datasource found", () => {
    const config: GrammarConfig = {
      marks: [{ type: "bar", x: "x", y: "y" }],
    };

    expect(() => compileOption(config)).toThrow("No data source");
  });

  it("should throw if mark missing x or y", () => {
    const config: GrammarConfig = {
      data: {
        type: "object-array",
        data: [{ a: 1 }],
      },
      marks: [{ type: "bar", x: "" as any, y: "" as any }],
    };

    expect(() => compileOption(config)).toThrow();
  });
});
