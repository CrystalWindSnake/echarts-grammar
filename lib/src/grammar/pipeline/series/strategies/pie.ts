import { genSeriesId } from "@/grammar/core/id-generator";
import { SeriesStrategy } from "../series-factory";
import {
  MarkConfig,
  PieMarkConfig,
  SeriesBuildContext,
  XYMarkConfig,
} from "@/grammar/core/types";

export class PieSeriesStrategy implements SeriesStrategy {
  supports(type: MarkConfig["type"]) {
    return type === "pie";
  }

  requireAxis(mark: MarkConfig): mark is XYMarkConfig {
    return false;
  }

  build(mark: PieMarkConfig, ctx: SeriesBuildContext): any[] {
    return [
      {
        id: genSeriesId(),
        type: "pie",
        datasetId: ctx.datasetId,
        encode: {
          value: mark.angle || "value",
          itemName: mark.category || "name",
        },
        ...(mark.options || {}),
      },
    ];
  }
}
