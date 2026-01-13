import { GrammarConfig } from "@/core/types";

export function validateConfig(config: GrammarConfig) {
  if (!config.marks || config.marks.length === 0) {
    throw new Error("At least one mark is required");
  }

  for (const mark of config.marks) {
    if (!mark.x || !mark.y) {
      throw new Error("Mark must define x and y");
    }
  }

  const facet = config.facet;
  if (facet && !facet.row && !facet.col) {
    throw new Error("Facet build requires facet.row or facet.col");
  }
}
