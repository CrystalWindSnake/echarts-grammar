import { GrammarConfig, XYMarkConfig } from "@/core/types";
import { validateConfig } from "@/core/validator";
import { resetIds } from "@/core/id-generator";
import { seriesFactory } from "@/core/series";
import { buildDataset } from "./dataset-builder";
import { buildGrid } from "./grid-builder";
import { buildAxes } from "./axis-builder";
import { buildMatrix } from "./matrix-builder";

export function compile(config: GrammarConfig): any {
  validateConfig(config);
  resetIds();

  if (config.facet) {
    return compileFacet(config);
  }

  return compileNonFacet(config);
}

function compileFacet(config: GrammarConfig) {
  if (!config.data) throw new Error("facet requires global data");

  const { datasets, matrix, grids, xAxisArr, yAxisArr, seriesMetas } =
    buildMatrix(config);

  // 遍历 seriesMetas，为每个 mark 生成 series
  const series: any[] = [];

  for (const meta of seriesMetas) {
    for (const m of config.marks) {
      const sStrategy = seriesFactory.getStrategy(m.type);

      // axisId 由 XY mark 决定
      let axisId = meta.axisId;
      if (sStrategy.requireAxis(m)) {
        const xyMark = m as XYMarkConfig;
        const {
          xAxis,
          yAxis,
          axisId: aId,
        } = buildAxes(meta.gridId, xyMark.x, xyMark.y);

        axisId = aId;
        // 避免重复插入 axis
        if (!xAxisArr.find((a) => a.id === axisId)) xAxisArr.push(xAxis);
        if (!yAxisArr.find((a) => a.id === axisId)) yAxisArr.push(yAxis);
      }

      const s = sStrategy.build(m, {
        datasetId: meta.datasetId,
        gridId: meta.gridId,
        axisId,
      });
      series.push(...s);
    }
  }

  return {
    dataset: datasets,
    matrix,
    grid: grids,
    xAxis: xAxisArr,
    yAxis: yAxisArr,
    series,
    ...(config.echarts || {}),
  };
}

function compileNonFacet(config: GrammarConfig) {
  const datasets: any[] = [];
  const series: any[] = [];
  const xAxisArr: any[] = [];
  const yAxisArr: any[] = [];
  const grids: any[] = [];

  const datasetCache = new Map<any, string>();

  const { id: gridId, grid } = buildGrid();
  grids.push(grid);

  for (const mark of config.marks) {
    const dataSource = mark.data || config.data;
    if (!dataSource) {
      throw new Error("No data source found for mark");
    }

    let datasetId: string;

    if (datasetCache.has(dataSource)) {
      datasetId = datasetCache.get(dataSource)!;
    } else {
      const built = buildDataset(dataSource);
      datasetId = built.id;
      datasetCache.set(dataSource, datasetId);
      datasets.push(built.dataset);
    }

    const strategy = seriesFactory.getStrategy(mark.type);

    let axisId: string | undefined;

    if (strategy.requireAxis(mark)) {
      const { xAxis, yAxis, axisId: aId } = buildAxes(gridId, mark.x, mark.y);
      axisId = aId;

      if (!xAxisArr.find((a) => a.id === axisId)) {
        xAxisArr.push(xAxis);
        yAxisArr.push(yAxis);
      }
    }

    const s = strategy.build(mark as any, {
      datasetId,
      gridId,
      axisId,
    });

    series.push(...s);
  }

  return {
    dataset: datasets,
    grid: grids,
    series,
    xAxis: xAxisArr,
    yAxis: yAxisArr,
    ...(config.echarts || {}),
  };
}
