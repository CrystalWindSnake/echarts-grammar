import { GrammarToEchartsConverter } from "../grammar-to-echarts-tools";
import type {
  BarMarkConfig,
  NormalizedGrammarConfig,
  NormalizedMarkConfig,
} from "../types";
import * as chartSystems from "./chart-systems";
import {
  cartesian2dXAxisConfig,
  cartesian2dYAxisConfig,
} from "./default-config";

export function handleBarMark(
  mark: NormalizedMarkConfig<BarMarkConfig>,
  normalizedConfig: NormalizedGrammarConfig,
  echartsConverter: GrammarToEchartsConverter
) {
  const x = mark.x || "x";
  const y = mark.y || "y";
  const color = mark.color;
  const seriesOptions = mark.echarts || {};
  const { facetInfo } = normalizedConfig;
  const { row, column } = mark.facet || {};
  const needFacetRow = row !== undefined;
  const needFacetColumn = column !== undefined;

  const colorType = color
    ? chartSystems.useFieldType({
        dataset: mark.data,
        field: color,
      })
    : undefined;

  facetInfo.rowValues.forEach((rowValue) => {
    facetInfo.columnValues.forEach((columnValue) => {
      const axes = echartsConverter.getAxes({
        rowValue,
        columnValue,
      });

      const xAxisId = axes.fillXAxisConfig({
        config: chartSystems.useXAxisBaseConfig({
          xType: "category",
          xField: x,
          extendConfig: cartesian2dXAxisConfig,
        }),
        xName: x,
      });
      const yAxisId = axes.fillYAxisConfig({
        config: chartSystems.useYAxisBaseConfig({
          yType: "value",
          yField: y,
          extendConfig: cartesian2dYAxisConfig,
        }),
        yName: y,
      });

      for (const colorValue of chartSystems.iterValuesByColor(
        mark.data,
        color,
        colorType
      )) {
        const datasetFilters = [];

        if (needFacetRow) {
          datasetFilters.push({ dim: row, value: rowValue });
        }

        if (needFacetColumn) {
          datasetFilters.push({ dim: column, value: columnValue });
        }

        if (color && colorType === "category") {
          datasetFilters.push({ dim: color, value: colorValue });
        }

        const { labelConfig, encodeLabelConfig } = chartSystems.useEncodeLabel(
          mark.label,
          {
            label: {
              show: true,
              position: "insideTop",
            },
          }
        );

        const { encodeTooltipConfig } = chartSystems.useEncodeTooltip(
          mark.tooltip
        );

        const series = {
          ...seriesOptions,
          type: "bar",
          ...labelConfig,
          encode: { x, y, ...encodeLabelConfig, ...encodeTooltipConfig },
          datasetId: echartsConverter.datasetManager.getDatasetId({
            data: mark.data,
            filters: datasetFilters,
          }),
          xAxisId,
          yAxisId,
        };

        echartsConverter.addSeries(series);
      }
    });
  });
}
