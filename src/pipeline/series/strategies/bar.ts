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
    if (!mark.color) {
      return [this.buildSingle(mark, ctx.datasetId, ctx)];
    }

    const series: any[] = [];
    const grouped = ctx.datasetPipeline.groupByDistinct(
      ctx.datasetId,
      mark.color
    );

    for (const [colorValue, datasetId] of grouped.entries()) {
      series.push(this.buildSingle(mark, datasetId, ctx, String(colorValue)));
    }

    return series;
  }

  private buildSingle(
    mark: BarMarkConfig,
    datasetId: string,
    ctx: SeriesBuildContext,
    name?: string
  ) {
    const labelConfig = mark.label
      ? {
          label: {
            show: true,
            position: "insideTop",
          },
        }
      : undefined;

    return {
      id: genSeriesId(),
      name,
      type: mark.type,
      datasetId,
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
    };
  }
}
