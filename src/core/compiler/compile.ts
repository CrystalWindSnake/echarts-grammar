import { GrammarConfig } from "@/core/types";
import { validateConfig } from "@/core/validator";
import { genSeriesId, resetIds } from "@/core/id-generator";
import { buildDataset } from "./dataset-builder";
import { buildGrid } from "./grid-builder";
import { buildAxes } from "./axis-builder";
import { buildSeries } from "./series-builder";
import { buildMatrix } from "./matrix-builder";

export function compile(config: GrammarConfig): any {
  validateConfig(config);
  resetIds();

  if (config.facet) {
    if (!config.data) throw new Error("facet requires global data");

    const { datasets, matrix, grids, xAxisArr, yAxisArr, seriesMetas } =
      buildMatrix(config);

    const mark = config.marks[0];

    const series = seriesMetas.map((meta) => ({
      id: genSeriesId(),
      type: mark.type,
      datasetId: meta.datasetId,
      gridId: meta.gridId,
      xAxisId: meta.axisId,
      yAxisId: meta.axisId,
      encode: {
        x: mark.x,
        y: mark.y,
      },
    }));

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

    const { xAxis, yAxis, axisId } = buildAxes(gridId, mark.x, mark.y);

    if (!xAxisArr.find((a) => a.id === axisId)) {
      xAxisArr.push(xAxis);
      yAxisArr.push(yAxis);
    }

    const s = buildSeries(mark, datasetId, axisId);
    series.push(s);
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
