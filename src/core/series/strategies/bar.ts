import { genSeriesId } from "@/core/id-generator";
import { SeriesStrategy } from "../series-factory";
import {
  BarMarkConfig,
  MarkConfig,
  SeriesBuildContext,
  XYMarkConfig,
} from "@/core/types";

export class BarSeriesStrategy implements SeriesStrategy {
  supports(type: MarkConfig["type"]) {
    return type === "bar";
  }

  requireAxis(mark: MarkConfig): mark is XYMarkConfig {
    return mark.type === "bar";
  }

  build(mark: BarMarkConfig, ctx: SeriesBuildContext): any[] {
    const labelConfig = mark.label
      ? {
          label: {
            show: true,
            position: "insideTop",
          },
        }
      : undefined;

    return [
      {
        id: genSeriesId(),
        type: mark.type,
        datasetId: ctx.datasetId,
        xAxisId: ctx.axisId,
        yAxisId: ctx.axisId,
        ...labelConfig,
        encode: {
          x: mark.x || "x",
          y: mark.y || "y",
          ...(mark.tooltip && { tooltip: mark.tooltip }),
          ...(mark.label && { label: mark.label }),
        },
        ...(mark.options || {}),
      },
    ];
  }
}
