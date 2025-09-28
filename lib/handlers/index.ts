import { handleBarMark } from "./bar";
import { handleLineMark } from "./line";
import { handlePieMark } from "./pie";
import { handleScatterMark } from "./scatter";
import type {
  BarMarkConfig,
  LineMarkConfig,
  NormalizedGrammarConfig,
  NormalizedMarkConfig,
  PieMarkConfig,
  ScatterMarkConfig,
  StrictMarkConfig,
} from "../types";
import { type GrammarToEchartsConverter } from "../grammar-to-echarts-tools";

export function processMark(
  mark: StrictMarkConfig,
  normalizedConfig: NormalizedGrammarConfig,
  echartsConverter: GrammarToEchartsConverter
) {
  switch (mark.type) {
    case "bar":
      return handleBarMark(
        mark as NormalizedMarkConfig<BarMarkConfig>,
        normalizedConfig,
        echartsConverter
      );
    case "line":
      return handleLineMark(
        mark as NormalizedMarkConfig<LineMarkConfig>,
        normalizedConfig,
        echartsConverter
      );
    case "pie":
      return handlePieMark(
        mark as NormalizedMarkConfig<PieMarkConfig>,
        normalizedConfig,
        echartsConverter
      );
    case "scatter":
      return handleScatterMark(
        mark as NormalizedMarkConfig<ScatterMarkConfig>,
        normalizedConfig,
        echartsConverter
      );
    default:
      throw new Error(`Unsupported mark type: ${mark.type}`);
  }
}
