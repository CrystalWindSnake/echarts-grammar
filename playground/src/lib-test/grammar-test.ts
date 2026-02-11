import * as echarts from "echarts";
import { compileOption, GrammarConfig } from "echarts-grammar";

export function run() {
  document.getElementById("app")!.innerHTML += '<div id="chart"></div>';

  const data = [
    { region: "华东", quarter: "Q1", category: "家具", sales: 120 },
    { region: "华东", quarter: "Q1", category: "办公用品", sales: 80 },
    { region: "华东", quarter: "Q1", category: "技术", sales: 150 },
    { region: "华东", quarter: "Q2", category: "家具", sales: 150 },
    { region: "华东", quarter: "Q2", category: "办公用品", sales: 90 },
    { region: "华东", quarter: "Q2", category: "技术", sales: 180 },
    { region: "华南", quarter: "Q1", category: "家具", sales: 100 },
    { region: "华南", quarter: "Q1", category: "办公用品", sales: 200 },
    { region: "华南", quarter: "Q1", category: "技术", sales: 130 },
    { region: "华南", quarter: "Q2", category: "家具", sales: 130 },
    { region: "华南", quarter: "Q2", category: "办公用品", sales: 85 },
    { region: "华南", quarter: "Q2", category: "技术", sales: 160 },
    { region: "华北", quarter: "Q1", category: "家具", sales: 110 },
    { region: "华北", quarter: "Q1", category: "办公用品", sales: 75 },
    { region: "华北", quarter: "Q1", category: "技术", sales: 140 },
    { region: "华北", quarter: "Q2", category: "家具", sales: 140 },
    { region: "华北", quarter: "Q2", category: "办公用品", sales: 95 },
    { region: "华北", quarter: "Q2", category: "技术", sales: 170 },
  ];
  const config: GrammarConfig = {
    data: { type: "object-array", data },
    facet: { row: "region" },
    marks: [
      {
        type: "bar",
        x: "quarter",
        y: "sales",
        color: "category",
        // transpose: true,
        // stack: false,
      },
    ],
  };

  // compileOption(config);
  const chartOption = {
    dataset: [
      {
        dimensions: [
          {
            name: "region",
          },
          {
            name: "quarter",
          },
          {
            name: "category",
          },
          {
            name: "sales",
          },
        ],
        source: [
          ["华东", "Q1", "家具", 120],
          ["华东", "Q1", "办公用品", 80],
          ["华东", "Q1", "技术", 150],
          ["华东", "Q2", "家具", 150],
          ["华东", "Q2", "办公用品", 90],
          ["华东", "Q2", "技术", 180],
          ["华南", "Q1", "家具", 100],
          ["华南", "Q1", "办公用品", 200],
          ["华南", "Q1", "技术", 130],
          ["华南", "Q2", "家具", 130],
          ["华南", "Q2", "办公用品", 85],
          ["华南", "Q2", "技术", 160],
          ["华北", "Q1", "家具", 110],
          ["华北", "Q1", "办公用品", 75],
          ["华北", "Q1", "技术", 140],
          ["华北", "Q2", "家具", 140],
          ["华北", "Q2", "办公用品", 95],
          ["华北", "Q2", "技术", 170],
        ],
        id: "dataset-1",
      },
      {
        fromDatasetId: "dataset-1",
        transform: {
          type: "filter",
          config: {
            and: [
              {
                dimension: "region",
                "=": "华东",
              },
            ],
          },
        },
        id: "dataset-2",
      },
      {
        fromDatasetId: "dataset-2",
        transform: {
          type: "filter",
          config: {
            dimension: "category",
            "=": "家具",
          },
        },
        id: "dataset-3",
      },
      {
        fromDatasetId: "dataset-2",
        transform: {
          type: "filter",
          config: {
            dimension: "category",
            "=": "办公用品",
          },
        },
        id: "dataset-4",
      },
      {
        fromDatasetId: "dataset-2",
        transform: {
          type: "filter",
          config: {
            dimension: "category",
            "=": "技术",
          },
        },
        id: "dataset-5",
      },
      {
        fromDatasetId: "dataset-1",
        transform: {
          type: "filter",
          config: {
            and: [
              {
                dimension: "region",
                "=": "华南",
              },
            ],
          },
        },
        id: "dataset-6",
      },
      {
        fromDatasetId: "dataset-6",
        transform: {
          type: "filter",
          config: {
            dimension: "category",
            "=": "家具",
          },
        },
        id: "dataset-7",
      },
      {
        fromDatasetId: "dataset-6",
        transform: {
          type: "filter",
          config: {
            dimension: "category",
            "=": "办公用品",
          },
        },
        id: "dataset-8",
      },
      {
        fromDatasetId: "dataset-6",
        transform: {
          type: "filter",
          config: {
            dimension: "category",
            "=": "技术",
          },
        },
        id: "dataset-9",
      },
      {
        fromDatasetId: "dataset-1",
        transform: {
          type: "filter",
          config: {
            and: [
              {
                dimension: "region",
                "=": "华北",
              },
            ],
          },
        },
        id: "dataset-10",
      },
      {
        fromDatasetId: "dataset-10",
        transform: {
          type: "filter",
          config: {
            dimension: "category",
            "=": "家具",
          },
        },
        id: "dataset-11",
      },
      {
        fromDatasetId: "dataset-10",
        transform: {
          type: "filter",
          config: {
            dimension: "category",
            "=": "办公用品",
          },
        },
        id: "dataset-12",
      },
      {
        fromDatasetId: "dataset-10",
        transform: {
          type: "filter",
          config: {
            dimension: "category",
            "=": "技术",
          },
        },
        id: "dataset-13",
      },
    ],
    grid: [
      {
        left: "left",
        top: "top",
        bottom: 0,
        right: 0,
        outerBounds: {
          left: 5,
          top: 20,
          right: 20,
          bottom: 20,
        },
        coordinateSystem: "matrix",
        coord: ["华东", "-1"],
        matrixId: "matrix-1",
        id: "grid-1",
      },
      {
        left: "left",
        top: "top",
        bottom: 0,
        right: 0,
        outerBounds: {
          left: 5,
          top: 20,
          right: 20,
          bottom: 20,
        },
        coordinateSystem: "matrix",
        coord: ["华南", "-1"],
        matrixId: "matrix-1",
        id: "grid-2",
      },
      {
        left: "left",
        top: "top",
        bottom: 0,
        right: 0,
        outerBounds: {
          left: 5,
          top: 20,
          right: 20,
          bottom: 20,
        },
        coordinateSystem: "matrix",
        coord: ["华北", "-1"],
        matrixId: "matrix-1",
        id: "grid-3",
      },
    ],
    xAxis: [
      {
        type: "category",
        gridId: "grid-1",
        id: "x-axis-1",
      },
      {
        type: "category",
        gridId: "grid-2",
        id: "x-axis-2",
      },
      {
        type: "category",
        gridId: "grid-3",
        id: "x-axis-3",
      },
    ],
    yAxis: [
      {
        type: "value",
        gridId: "grid-1",
        id: "y-axis-1",
      },
      {
        type: "value",
        gridId: "grid-2",
        id: "y-axis-2",
      },
      {
        type: "value",
        gridId: "grid-3",
        id: "y-axis-3",
      },
    ],
    series: [
      {
        type: "bar",
        name: "家具",
        encode: {
          x: "quarter",
          y: "sales",
        },
        itemStyle: {
          color: "#5470c6",
        },
        itemPayload: {
          colorCount: 3,
          colorIndex: 0,
        },
        datasetId: "dataset-3",
        xAxisId: "x-axis-1",
        yAxisId: "y-axis-1",
        id: "series-1",
      },
      {
        type: "bar",
        name: "办公用品",
        encode: {
          x: "quarter",
          y: "sales",
        },
        itemStyle: {
          color: "#91cc75",
        },
        itemPayload: {
          colorCount: 3,
          colorIndex: 1,
        },
        datasetId: "dataset-4",
        xAxisId: "x-axis-1",
        yAxisId: "y-axis-1",
        id: "series-2",
      },
      {
        type: "bar",
        name: "技术",
        encode: {
          x: "quarter",
          y: "sales",
        },
        itemStyle: {
          color: "#fac858",
        },
        itemPayload: {
          colorCount: 3,
          colorIndex: 2,
        },
        datasetId: "dataset-5",
        xAxisId: "x-axis-1",
        yAxisId: "y-axis-1",
        id: "series-3",
      },
      {
        type: "bar",
        name: "家具",
        encode: {
          x: "quarter",
          y: "sales",
        },
        itemStyle: {
          color: "#5470c6",
        },
        itemPayload: {
          colorCount: 3,
          colorIndex: 0,
        },
        datasetId: "dataset-7",
        xAxisId: "x-axis-2",
        yAxisId: "y-axis-2",
        id: "series-4",
      },
      {
        type: "bar",
        name: "办公用品",
        encode: {
          x: "quarter",
          y: "sales",
        },
        itemStyle: {
          color: "#91cc75",
        },
        itemPayload: {
          colorCount: 3,
          colorIndex: 1,
        },
        datasetId: "dataset-8",
        xAxisId: "x-axis-2",
        yAxisId: "y-axis-2",
        id: "series-5",
      },
      {
        type: "bar",
        name: "技术",
        encode: {
          x: "quarter",
          y: "sales",
        },
        itemStyle: {
          color: "#fac858",
        },
        itemPayload: {
          colorCount: 3,
          colorIndex: 2,
        },
        datasetId: "dataset-9",
        xAxisId: "x-axis-2",
        yAxisId: "y-axis-2",
        id: "series-6",
      },
      {
        type: "bar",
        name: "家具",
        encode: {
          x: "quarter",
          y: "sales",
        },
        itemStyle: {
          color: "#5470c6",
        },
        itemPayload: {
          colorCount: 3,
          colorIndex: 0,
        },
        datasetId: "dataset-11",
        xAxisId: "x-axis-3",
        yAxisId: "y-axis-3",
        id: "series-7",
      },
      {
        type: "bar",
        name: "办公用品",
        encode: {
          x: "quarter",
          y: "sales",
        },
        itemStyle: {
          color: "#91cc75",
        },
        itemPayload: {
          colorCount: 3,
          colorIndex: 1,
        },
        datasetId: "dataset-12",
        xAxisId: "x-axis-3",
        yAxisId: "y-axis-3",
        id: "series-8",
      },
      {
        type: "bar",
        name: "技术",
        encode: {
          x: "quarter",
          y: "sales",
        },
        itemStyle: {
          color: "#fac858",
        },
        itemPayload: {
          colorCount: 3,
          colorIndex: 2,
        },
        datasetId: "dataset-13",
        xAxisId: "x-axis-3",
        yAxisId: "y-axis-3",
        id: "series-9",
      },
    ],
    matrix: [
      {
        x: {
          data: ["华东", "华南", "华北"],
          itemStyle: {
            borderWidth: 0,
          },
          levelSize: 30,
          show: true,
        },
        backgroundStyle: {
          borderWidth: 0,
        },
        body: {
          itemStyle: {
            borderWidth: 0,
          },
        },
        y: {
          data: ["-1"],
          show: false,
        },
        id: "matrix-1",
      },
    ],
    legend: {},
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
  };

  console.log(chartOption);

  // ======================================================

  // 初始化图表

  const chartDom = document.getElementById("chart");
  const myChart = echarts.init(chartDom);

  // 应用配置
  myChart.setOption(chartOption);
}
