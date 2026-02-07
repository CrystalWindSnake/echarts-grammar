import * as echarts from "echarts";
import {
  DatasetCollector,
  AxisCollector,
  GridCollector,
  SeriesCollector,
  MatrixCollector,
} from "echarts-grammar/options-builder";
import {
  filterTransform,
  andTransform,
} from "echarts-grammar/options-builder/builders";
import { scaleOrdinal } from "d3-scale";
import { intervalFn } from "@/custom/interval";

type TCollectors = {
  datasets: DatasetCollector;
  grids: GridCollector;
  xAxis: AxisCollector;
  yAxis: AxisCollector;
  series: SeriesCollector;
  matrix: MatrixCollector;
};

const DEFAULT_COLOR = [
  "#5470c6",
  "#91cc75",
  "#fac858",
  "#ee6666",
  "#73c0de",
  "#3ba272",
  "#fc8452",
  "#9a60b4",
  "#ea7ccc",
];

const DEFAULT_MATRIX_CONFIG = {
  MATRIX: {
    backgroundStyle: {
      borderWidth: 0,
    },
    body: {
      itemStyle: {
        borderWidth: 0,
      },
    },
  },
  X: {
    itemStyle: {
      borderWidth: 0,
    },
    levelSize: 30,
    show: true,
  },
  Y: {
    itemStyle: {
      borderWidth: 0,
    },
    levelSize: 30,
    show: true,
  },
};

const DEFAULT_GRID_CONFIG = {
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
};

/**
 * 从二维表格数据中提取指定列的去重值
 * @param data 表格数据，第一行为表头
 * @param columnName 要提取的列名
 * @returns 去重后的值数组（顺序按首次出现）
 */
function getUniqueColumnValues<T = string | number>(
  data: (string | number)[][],
  columnName: string,
): T[] {
  if (!Array.isArray(data) || data.length === 0) {
    return [] as T[];
  }

  const [headers, ...rows] = data;

  if (!Array.isArray(headers)) {
    throw new Error("Invalid table format: headers must be an array");
  }

  const colIndex = headers.indexOf(columnName);
  if (colIndex === -1) {
    throw new Error(
      `Column "${columnName}" not found in headers: [${headers.join(", ")}]`,
    );
  }

  const values = rows.map((row) => {
    if (!Array.isArray(row) || row.length <= colIndex) {
      throw new Error(
        `Row is invalid or missing column at index ${colIndex}: ${JSON.stringify(row)}`,
      );
    }
    return row[colIndex] as T;
  });

  // 使用 Set 去重并保持插入顺序
  return [...new Set(values)];
}

type XBaseMarkConfig = {
  encode: { x: string; y: string | string[]; color?: string };
  seriseConfig: { type: string } & Record<string, any>;
  axisShard?: boolean;
  collectors: TCollectors;
  gridId: string;
  dsId: string;
};

function xbaseMark(config: XBaseMarkConfig) {
  const {
    axisShard = true,
    encode,
    collectors,
    gridId,
    dsId,
    seriseConfig,
  } = config;

  const { id: xAxisId } = collectors.xAxis.newAxisWithReuse(
    {
      type: "category",
      gridId,
    },
    (e) =>
      e.gridId === gridId &&
      (axisShard ||
        (e as unknown as { encode: { x: string } }).encode.x === encode.x),
  );

  const { id: yAxisId } = collectors.yAxis.newAxisWithReuse(
    {
      type: "value",
      gridId,
    },
    (e) =>
      e.gridId === gridId &&
      (axisShard ||
        (e as unknown as { encode: { y: string } }).encode.y === encode.y),
  );

  if (encode.color) {
    const source = collectors.datasets.getResolvedData(dsId);
    const colorScale = scaleOrdinal(DEFAULT_COLOR);

    const colorValues = source.column(encode.color, true);

    for (const [index, color] of colorValues.entries()) {
      const paletteColor = colorScale(color);

      const { id: dsTfId } = collectors.datasets.newFromTransform(
        dsId,
        filterTransform(encode.color, "=", color),
      );

      const { color: _, ...realEncode } = encode;

      const itemPayload = {
        colorCount: colorValues.length,
        colorIndex: index,
      };

      collectors.series.newCartesianSeries(
        { datasetId: dsTfId, xAxisId, yAxisId },
        {
          name: color,
          ...seriseConfig,
          encode: realEncode,
          itemStyle: { color: paletteColor },
          itemPayload,
        },
      );
    }
  } else {
    collectors.series.newCartesianSeries(
      { datasetId: dsId, xAxisId, yAxisId },
      {
        name: encode.x,
        ...seriseConfig,
        encode,
        color: DEFAULT_COLOR,
      },
    );
  }
}

function lineMark(config: Omit<XBaseMarkConfig, "seriseConfig">) {
  return xbaseMark({ ...config, seriseConfig: { type: "line" } });
}

function intervalMark(config: Omit<XBaseMarkConfig, "seriseConfig">) {
  return xbaseMark({
    ...config,
    seriseConfig: { type: "custom", renderItem: intervalFn },
  });
}

function barMark(config: Omit<XBaseMarkConfig, "seriseConfig">) {
  return xbaseMark({
    ...config,
    seriseConfig: { type: "bar" },
  });
}

function createCollectors() {
  const datasets = new DatasetCollector();
  const grids = new GridCollector();
  const xAxis = new AxisCollector("x-axis");
  const yAxis = new AxisCollector("y-axis");
  const series = new SeriesCollector();
  const matrix = new MatrixCollector();

  function exportOptions() {
    return {
      dataset: datasets.exportDatasets(),
      grid: grids.exportGrids(),
      xAxis: xAxis.exportAxes(),
      yAxis: yAxis.exportAxes(),
      series: series.exportSeries(),
      matrix: matrix.exportMatrixs(),
    };
  }

  return {
    datasets,
    grids,
    xAxis,
    yAxis,
    series,
    matrix,
    exportOptions,
  };
}

function exp1() {
  const collectors = createCollectors();

  const data = [
    ["name", "value", "row", "value2"],
    ["A", 1, "x1", -1],
    ["B", 2, "x1", -2],
    ["A", 5, "x2", 2],
    ["B", 10, "x2", 7],
  ];

  const { id: dsId } = collectors.datasets.newFromSource(data);
  const { id: gridId } = collectors.grids.newGrid();

  intervalMark({
    encode: { x: "name", y: ["value", "value2"], color: "row" },
    collectors,
    gridId,
    dsId,
  });

  // lineMark({
  //   encode: { x: "name", y: "value", color: "row" },
  //   collectors,
  //   gridId,
  //   dsId,
  // });

  return collectors.exportOptions();
}

function exp2() {
  const collectors = createCollectors();

  const data = [
    ["name", "value", "row", "col", "color"],
    ["A", 1, "r1", "c1", "cl1"],
    ["B", 2, "r1", "c1", "cl1"],
    ["A", 10, "r1", "c1", "cl2"],
    ["B", 20, "r1", "c1", "cl2"],

    ["A", 1, "r1", "c2", "cl1"],
    ["B", 2, "r1", "c2", "cl1"],
    ["A", 15, "r1", "c2", "cl2"],
    ["B", 25, "r1", "c2", "cl2"],

    ["A", 1, "r2", "c1", "cl1"],
    ["B", 2, "r2", "c1", "cl1"],
    ["A", 12, "r2", "c1", "cl2"],
    ["B", 22, "r2", "c1", "cl2"],

    ["A", 2, "r2", "c2", "cl1"],
    ["B", 10, "r2", "c2", "cl1"],
    ["A", 21, "r2", "c2", "cl2"],
    ["B", 11, "r2", "c2", "cl2"],
  ];

  const facet = {
    x: "row",
    y: "col",
  };

  const { x: facetX, y: facetY } = facet;

  const { id: dsId } = collectors.datasets.newFromSource(data);
  const { id: matrixId } = collectors.matrix.newRaw({
    x: {
      data: getUniqueColumnValues(data, facetX),
      ...DEFAULT_MATRIX_CONFIG.X,
    },
    y: {
      data: getUniqueColumnValues(data, facetY),
      ...DEFAULT_MATRIX_CONFIG.Y,
    },
    ...DEFAULT_MATRIX_CONFIG.MATRIX,
  });

  for (const row of getUniqueColumnValues(data, facetX)) {
    for (const col of getUniqueColumnValues(data, facetY)) {
      const { id: gridId } = collectors.grids.newGridFromMatrix(
        {
          id: matrixId,
          xValue: row,
          yValue: col,
        },
        {
          ...DEFAULT_GRID_CONFIG,
        },
      );

      const { id: dsTfId } = collectors.datasets.newFromTransform(
        dsId,
        andTransform(
          filterTransform(facetX, "=", row),
          filterTransform(facetY, "=", col),
        ),
        (table) =>
          table.filterRows((obj) => obj[facetX] === row && obj[facetY] === col),
      );

      intervalMark({
        encode: { x: "name", y: "value", color: "color" },
        collectors,
        gridId,
        dsId: dsTfId,
      });
    }
  }

  return collectors.exportOptions();
}

export function run() {
  document.getElementById("app")!.innerHTML += '<div id="chart"></div>';

  const options = exp1();
  console.log(options);

  // ======================================================

  // 初始化图表

  const chartDom = document.getElementById("chart");
  const myChart = echarts.init(chartDom, null, { renderer: "svg" });

  // 应用配置
  myChart.setOption({
    ...options,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {},
  });
}
