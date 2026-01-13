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
});
