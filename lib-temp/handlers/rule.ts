import { mergeEChartsOptions } from "@/systems/echarts-systems";
import {
  type AxesItem,
  GrammarToEchartsConverter,
} from "../grammar-to-echarts-tools";
import type {
  RuleMarkConfig,
  NormalizedGrammarConfig,
  NormalizedMarkConfig,
} from "../types";
import * as chartSystems from "./chart-systems";
import {
  cartesian2dXAxisConfig,
  cartesian2dYAxisConfig,
} from "./default-config";

export function handleRuleMark(
  mark: NormalizedMarkConfig<RuleMarkConfig>,
  normalizedConfig: NormalizedGrammarConfig,
  echartsConverter: GrammarToEchartsConverter
) {
  const { facetInfo } = normalizedConfig;

  const mode = mark.value ? "value" : "map";
  const axisType = mark.rType;

  facetInfo.rowValues.forEach((rowValue) => {
    facetInfo.columnValues.forEach((columnValue) => {
      const axes = echartsConverter.getAxes({
        rowValue,
        columnValue,
      });

      const datasetWithFacet = new chartSystems.DatasetWrapper(
        mark.data
      ).filterWithFacet({
        facetConfig: mark.facet || {},
        rowValue,
        columnValue,
      });

      if (mode === "value") {
        addSeriesByValueMode(axes, axisType, mark, echartsConverter);
      } else if (mode === "map") {
        addSeriesByMapMode(
          axisType,
          mark,
          datasetWithFacet,
          axes,
          echartsConverter
        );
      }
    });
  });
}

function addSeriesByMapMode(
  axisType: "x" | "y",
  mark: NormalizedMarkConfig<RuleMarkConfig>,
  datasetWithFacet: chartSystems.DatasetWrapper,
  axes: AxesItem,
  echartsConverter: GrammarToEchartsConverter
) {
  const x = axisType === "x" ? mark.map!.x1! : mark.map!.y1!;
  const y = axisType === "x" ? mark.map!.y1! : mark.map!.x1!;

  const xValues = datasetWithFacet.getValues(x);
  const yValues = datasetWithFacet.getValues(y);

  const xAxisId = axes.fillXAxisConfig({
    config: chartSystems.useXAxisBaseConfig({
      xType: "value",
      xField: x,
      extendConfig: {
        ...cartesian2dXAxisConfig,
        min: Math.min(...xValues),
        max: Math.max(...xValues),
      },
    }),
    xName: x,
  });
  const yAxisId = axes.fillYAxisConfig({
    config: chartSystems.useYAxisBaseConfig({
      yType: "value",
      yField: y,
      extendConfig: {
        ...cartesian2dYAxisConfig,
        min: Math.min(...yValues),
        max: Math.max(...yValues),
      },
    }),
    yName: y,
  });

  const lineStyle = mergeEChartsOptions(
    {
      color: "black",
      type: "solid",
      width: 1,
    },
    mark.lineStyle
  );

  const data = genLinesData(mark, datasetWithFacet, axisType);

  const series = {
    type: "lines",
    xAxisId,
    yAxisId,
    coordinateSystem: "cartesian2d",
    polyline: true,
    lineStyle,
    data,
  };

  echartsConverter.addSeries(series);
}

function addSeriesByValueMode(
  axes: AxesItem,
  axisType: "x" | "y",
  mark: NormalizedMarkConfig<RuleMarkConfig>,
  echartsConverter: GrammarToEchartsConverter
) {
  const xAxisId = axes.getXAxisId();
  const yAxisId = axes.getYAxisId();
  const dataAxisName = axisType === "x" ? "xAxis" : "yAxis";
  const marklineData = mark.value!.value.map((v) => ({
    [dataAxisName]: v,
  }));

  const lineStyle = mergeEChartsOptions(
    {
      color: "black",
      type: "solid",
      width: 1,
    },
    mark.lineStyle
  );

  const series = {
    type: "line",
    xAxisId,
    yAxisId,
    data: [],
    markLine: {
      symbol: "none",
      label: { show: false },
      lineStyle,
      data: marklineData,
      animation: false,
    },
  };

  echartsConverter.addSeries(series);
}

function genLinesData(
  markConfig: NormalizedMarkConfig<RuleMarkConfig>,
  datasetWrapper: chartSystems.DatasetWrapper,
  axisType: "x" | "y"
) {
  const data = datasetWrapper.dataset.source;

  if (axisType === "x") {
    const x1 = markConfig.map!.x1!;
    const y1 = markConfig.map!.y1!;
    const y2 = markConfig.map!.y2!;

    const xIndex = markConfig.data!.dimensions.indexOf(x1);
    const y1Index = markConfig.data!.dimensions.indexOf(y1);
    const y2Index = markConfig.data!.dimensions.indexOf(y2);

    return data.map((rowData) => {
      const xValue = rowData[xIndex];
      const y1Value = rowData[y1Index];
      const y2Value = rowData[y2Index];

      return {
        coords: [
          [xValue, y1Value],
          [xValue, y2Value],
        ],
      };
    });
  }

  if (axisType === "y") {
    const y1 = markConfig.map!.y1!;
    const x1 = markConfig.map!.x1!;
    const x2 = markConfig.map!.x2!;

    const y1Index = markConfig.data!.dimensions.indexOf(y1);
    const x1Index = markConfig.data!.dimensions.indexOf(x1);
    const x2Index = markConfig.data!.dimensions.indexOf(x2);

    return data.map((rowData) => {
      const yValue = rowData[y1Index];
      const x1Value = rowData[x1Index];
      const x2Value = rowData[x2Index];

      return {
        coords: [
          [x1Value, yValue],
          [x2Value, yValue],
        ],
      };
    });
  }

  throw new Error(`Invalid axisType ${axisType}`);
}
