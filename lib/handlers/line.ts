import { GrammarToEchartsConverter } from "@/grammar-to-echarts-tools";
import type {
  LineMarkConfig,
  NormalizedGrammarConfig,
  NormalizedMarkConfig,
} from "@/types";
import * as chartSystems from "./chart-systems";

export function handleLineMark(
  mark: NormalizedMarkConfig<LineMarkConfig>,
  normalizedConfig: NormalizedGrammarConfig,
  echartsConverter: GrammarToEchartsConverter
) {
  const x = mark.x || "x";
  const y = mark.y || "y";
  const color = mark.color;
  const { facetInfo } = normalizedConfig;
  const { row, column } = mark.facet || {};
  const seriesOptions = mark.echarts || {};
  const needFacetRow = row !== undefined;
  const needFacetColumn = column !== undefined;

  facetInfo.rowValues.forEach((rowValue) => {
    facetInfo.columnValues.forEach((columnValue) => {
      const axes = echartsConverter.getAxes({
        rowValue,
        columnValue,
      });

      const xAxisId = axes.fillXAxisConfig({
        config: { type: "category" },
        xName: x,
      });
      const yAxisId = axes.fillYAxisConfig({
        config: { type: "value" },
        yName: y,
      });

      for (const colorValue of chartSystems.iterValuesByColor(
        mark.data,
        color
      )) {
        const datasetFilters = [];

        if (needFacetRow) {
          datasetFilters.push({ dim: row, value: rowValue });
        }

        if (needFacetColumn) {
          datasetFilters.push({ dim: column, value: columnValue });
        }

        if (color) {
          datasetFilters.push({ dim: color, value: colorValue });
        }

        const { labelConfig, encodeLabelConfig } = chartSystems.useEncodeLabel(
          mark.label,
          {
            label: {
              show: true,
              position: "top",
            },
          }
        );

        const { encodeTooltipConfig } = chartSystems.useEncodeTooltip(
          mark.tooltip
        );

        const series = {
          ...seriesOptions,
          type: "line",
          showSymbol: false,
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
