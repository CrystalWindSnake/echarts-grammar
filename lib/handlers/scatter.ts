import { GrammarToEchartsConverter } from "@/grammar-to-echarts-tools";
import type {
  ScatterMarkConfig,
  NormalizedGrammarConfig,
  NormalizedMarkConfig,
} from "@/types";
import * as chartSystems from "./chart-systems";

export function handleScatterMark(
  mark: NormalizedMarkConfig<ScatterMarkConfig>,
  normalizedConfig: NormalizedGrammarConfig,
  echartsConverter: GrammarToEchartsConverter
) {
  const x = mark.x || "x";
  const y = mark.y || "y";
  const color = mark.color;
  const size = mark.size;
  const { facetInfo } = normalizedConfig;
  const { row, column } = mark.facet || {};
  const seriesOptions = mark.echarts || {};
  const needFacetRow = row !== undefined;
  const needFacetColumn = column !== undefined;

  const colorType = color
    ? chartSystems.useFieldType({
        dataset: mark.data,
        field: color,
      })
    : undefined;

  const colorValuesRange = color
    ? chartSystems.getValuesRange({
        dataset: mark.data,
        field: color,
      })
    : undefined;

  const xType = chartSystems.useFieldType({
    dataset: mark.data,
    field: x,
  });
  const yType = chartSystems.useFieldType({
    dataset: mark.data,
    field: y,
  });

  facetInfo.rowValues.forEach((rowValue) => {
    facetInfo.columnValues.forEach((columnValue) => {
      const axes = echartsConverter.getAxes({
        rowValue,
        columnValue,
      });

      const xAxisId = axes.fillXAxisConfig({
        config: chartSystems.useXAxisBaseConfig({ xType, xField: x }),
        xName: x,
      });
      const yAxisId = axes.fillYAxisConfig({
        config: chartSystems.useYAxisBaseConfig({ yType, yField: y }),
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
              position: "top",
            },
          }
        );

        const { encodeTooltipConfig } = chartSystems.useEncodeTooltip(
          mark.tooltip
        );

        const series = {
          name: chartSystems.useSeriesName({ colorField: color, colorValue }),
          ...seriesOptions,
          type: "scatter",
          ...labelConfig,
          encode: { x, y, ...encodeLabelConfig, ...encodeTooltipConfig },
          datasetId: echartsConverter.datasetManager.getDatasetId({
            data: mark.data,
            filters: datasetFilters,
          }),
          xAxisId,
          yAxisId,
        };

        const seriesId = echartsConverter.addSeries(series);

        if (size) {
          echartsConverter.addVisualMap({
            show: false,
            type: "continuous",
            seriesId,
            dimension: size,
            inRange: {
              symbolSize: [10, 100],
            },
          });
        }

        if (color && colorType === "value") {
          echartsConverter.addVisualMap({
            show: false,
            type: "continuous",
            min: colorValuesRange![0],
            max: colorValuesRange![1],
            seriesId,
            dimension: color,
            inRange: {
              color: ["#053061", "#f4eeeb", "#67001f"],
            },
          });
        }
      }
    });
  });
}
