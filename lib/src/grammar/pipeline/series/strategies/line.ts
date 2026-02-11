import { scaleOrdinal } from "d3-scale";
import { SeriesStrategy } from "../series-factory";
import {
  LineMarkConfig,
  MarkConfig,
  SeriesBuildContext,
  XYMarkConfig,
} from "@/grammar/core/types";
import { filterTransform } from "@/options-builder/builders";
import * as common from "./common";

const SERIES_TYPE = "line";

export class LineSeriesStrategy implements SeriesStrategy {
  supports(type: MarkConfig["type"]) {
    return type === SERIES_TYPE;
  }

  build(ctx: SeriesBuildContext, mark: LineMarkConfig) {
    const { collectors, gridId, datasetId, themeColors } = ctx;
    const { axisShard = true, x = "x", y = "y", color, tooltip } = mark;
    const encodeTooltip = common.encodeTooltip(tooltip);

    const { id: xAxisId } = common.newXCategoryAxis({
      axisCollector: collectors.xAxis,
      gridId,
      axisShard,
      x,
    });

    const { id: yAxisId } = common.newYValueAxis({
      axisCollector: collectors.yAxis,
      gridId,
      axisShard,
      y,
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
            encode: {
              x,
              y,
              ...encodeTooltip,
            },
            itemStyle: { color: paletteColor },
            itemPayload,
            ...(mark.options || {}),
          },
        );
      }

      collectors.legends.newLegend({});
    } else {
      collectors.series.newCartesianSeries(
        { datasetId, xAxisId, yAxisId },
        {
          type: SERIES_TYPE,
          name: x,
          encode: {
            x,
            y,
            ...encodeTooltip,
          },
          ...(mark.options || {}),
        },
      );
    }
  }

  // private buildSingle(
  //   mark: LineMarkConfig,
  //   datasetId: string,
  //   ctx: SeriesBuildContext,
  //   name?: string,
  // ) {
  //   const labelConfig = mark.label
  //     ? {
  //         label: {
  //           show: true,
  //           position: "top",
  //         },
  //       }
  //     : undefined;

  //   return {
  //     id: genSeriesId(),
  //     name,
  //     type: mark.type,
  //     datasetId,
  //     xAxisId: ctx.axisId,
  //     yAxisId: ctx.axisId,
  //     ...labelConfig,
  //     encode: {
  //       x: mark.x || "x",
  //       y: mark.y || "y",
  //       ...(mark.tooltip && { tooltip: mark.tooltip }),
  //       ...(mark.label && { label: mark.label }),
  //     },
  //     ...(mark.options || {}),
  //   };
  // }
}
