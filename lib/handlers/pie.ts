import { GrammarToEchartsConverter } from "@/grammar-to-echarts-tools";
import type {
  NormalizedGrammarConfig,
  NormalizedMarkConfig,
  PieMarkConfig,
} from "@/types";
import * as chartSystems from "./chart-systems";

export function handlePieMark(
  mark: NormalizedMarkConfig<PieMarkConfig>,
  normalizedConfig: NormalizedGrammarConfig,
  echartsConverter: GrammarToEchartsConverter
) {
  const { facetInfo } = normalizedConfig;
  const { row, column } = mark.facet || {};
  const needFacetRow = row !== undefined;
  const needFacetColumn = column !== undefined;

  facetInfo.rowValues.forEach((rowValue) => {
    facetInfo.columnValues.forEach((columnValue) => {
      const datasetFilters = [];

      if (needFacetRow) {
        datasetFilters.push({ dim: row, value: rowValue });
      }

      if (needFacetColumn) {
        datasetFilters.push({ dim: column, value: columnValue });
      }

      const { encodeTooltipConfig } = chartSystems.useEncodeTooltip(
        mark.tooltip
      );

      const series = {
        type: "pie",
        encode: {
          name: mark.name || "name",
          value: mark.value || "value",
          ...encodeTooltipConfig,
        },
        datasetId: echartsConverter.datasetManager.getDatasetId({
          data: mark.data,
          filters: datasetFilters,
        }),
      };

      echartsConverter.addSeries(series);
    });
  });
}
