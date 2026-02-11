import { scaleOrdinal } from "d3-scale";
import { SeriesStrategy } from "../series-factory";
import {
  BarMarkConfig,
  MarkConfig,
  SeriesBuildContext,
  XYMarkConfig,
} from "@/grammar/core/types";
import { filterTransform } from "@/options-builder/builders";
import * as common from "./common";

const SERIES_TYPE = "bar";

export class BarSeriesStrategy implements SeriesStrategy {
  supports(type: MarkConfig["type"]) {
    return type === "bar";
  }

  build(ctx: SeriesBuildContext, mark: BarMarkConfig) {
    const { collectors, gridId, datasetId, themeColors, matrixCtx } = ctx;
    const {
      axisShard = true,
      x: markX = "x",
      y: markY = "y",
      color,
      tooltip,
      stack,
      transpose = false,
    } = mark;

    const x = transpose ? markY : markX;
    const y = transpose ? markX : markY;

    const encodeTooltip = common.encodeTooltip(tooltip);

    const { id: xAxisId } = transpose
      ? common.newXValueAxis({
          axisCollector: collectors.xAxis,
          gridId,
          axisShard,
          x,
          matrixCtx,
        })
      : common.newXCategoryAxis({
          axisCollector: collectors.xAxis,
          gridId,
          axisShard,
          x,
          matrixCtx,
        });

    const { id: yAxisId } = transpose
      ? common.newYCategoryAxis({
          axisCollector: collectors.yAxis,
          gridId,
          axisShard,
          y,
          matrixCtx,
        })
      : common.newYValueAxis({
          axisCollector: collectors.yAxis,
          gridId,
          axisShard,
          y,
          matrixCtx,
        });

    if (color) {
      const source = collectors.datasets.getResolvedData(datasetId);
      const colorScale = scaleOrdinal(themeColors);
      const colorValues = source.column(color, true);

      for (const [index, colorValue] of colorValues.entries()) {
        const paletteColor = colorScale(colorValue);

        const { id: dsTfId } = collectors.datasets.newFromTransform(
          datasetId,
          filterTransform(color, "=", colorValue),
        );

        const itemPayload = {
          colorCount: colorValues.length,
          colorIndex: index,
        };

        collectors.series.newCartesianSeries(
          { datasetId: dsTfId, xAxisId, yAxisId },
          {
            type: SERIES_TYPE,
            name: colorValue,
            stack,
            encode: {
              x,
              y,
              ...encodeTooltip,
            },
            itemStyle: { color: paletteColor },
            itemPayload,
          },
        );

        collectors.legends.defaultLegend({});
        collectors.tooltip.newTooltip({
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        });
      }
    } else {
      collectors.series.newCartesianSeries(
        { datasetId, xAxisId, yAxisId },
        {
          type: SERIES_TYPE,
          name: x,
          stack,
          encode: {
            x,
            y,
            ...encodeTooltip,
          },
          color: themeColors,
        },
      );
    }
  }
}
