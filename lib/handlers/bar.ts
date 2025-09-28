import { GrammarToEchartsConverter } from "../grammar-to-echarts-tools";
import type {
  BarMarkConfig,
  NormalizedGrammarConfig,
  NormalizedMarkConfig,
} from "../types";
import * as chartSystems from "./chart-systems";

export function handleBarMark(
  mark: NormalizedMarkConfig<BarMarkConfig>,
  normalizedConfig: NormalizedGrammarConfig,
  echartsConverter: GrammarToEchartsConverter
) {
  const x = mark.x || "x";
  const y = mark.y || "y";
  const { facetInfo } = normalizedConfig;
  const { row, column } = mark.facet || {};
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

      const datasetFilters = [];

      if (needFacetRow) {
        datasetFilters.push({ dim: row, value: rowValue });
      }

      if (needFacetColumn) {
        datasetFilters.push({ dim: column, value: columnValue });
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
    });
  });
}
