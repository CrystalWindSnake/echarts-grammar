import { genSeriesId } from "@/core/id-generator";
import { SeriesStrategy } from "../series-factory";
import {
  LineMarkConfig,
  MarkConfig,
  SeriesBuildContext,
  XYMarkConfig,
} from "@/core/types";

export class LineSeriesStrategy implements SeriesStrategy {
  supports(type: MarkConfig["type"]) {
    return type === "line";
  }

  requireAxis(mark: MarkConfig): mark is XYMarkConfig {
    return mark.type === "line";
  }

  build(mark: LineMarkConfig, ctx: SeriesBuildContext): any[] {
    const labelConfig = mark.label
      ? {
          label: {
            show: true,
            position: "top",
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
