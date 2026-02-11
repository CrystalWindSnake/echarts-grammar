import { AxisCollector } from "./axis-collector";
import { DatasetCollector } from "./dataset-collector";
import { GridCollector } from "./grid-collector";
import { MatrixCollector } from "./matrix-collector";
import { SeriesCollector } from "./series-collector";
import { LegendCollector } from "./legend-collector";
import { TooltipCollector } from "./tooltip-collector";

export type TCollectors = ReturnType<typeof createCollectors>;

export function createCollectors() {
  const datasets = new DatasetCollector();
  const grids = new GridCollector();
  const xAxis = new AxisCollector("x-axis");
  const yAxis = new AxisCollector("y-axis");
  const series = new SeriesCollector();
  const matrix = new MatrixCollector();
  const legends = new LegendCollector();
  const tooltip = new TooltipCollector();

  function exportOptions() {
    return {
      dataset: datasets.exportDatasets(),
      grid: grids.exportGrids(),
      xAxis: xAxis.exportAxes(),
      yAxis: yAxis.exportAxes(),
      series: series.exportSeries(),
      matrix: matrix.exportMatrixs(),
      legend: legends.exportLegends(),
      tooltip: tooltip.exportTooltip(),
    };
  }

  return {
    datasets,
    grids,
    xAxis,
    yAxis,
    series,
    matrix,
    legends,
    tooltip,
    exportOptions,
  };
}
