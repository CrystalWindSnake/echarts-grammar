import { describe, it, expect } from "vitest";
import {
  DatasetCollector,
  AxisCollector,
  GridCollector,
  SeriesCollector,
} from "@/options-builder";

describe("testing", () => {
  it("anying", () => {
    const datasets = new DatasetCollector();
    const grids = new GridCollector();
    const xAxes = new AxisCollector("x-axis");
    const yAxes = new AxisCollector("y-axis");
    const series = new SeriesCollector();

    const data = [
      ["name", "value"],
      ["A", 1],
      ["B", 2],
    ];

    const { id: dsId } = datasets.newFromMatrixSource(data);
    const { id: gridId } = grids.newGrid();

    const { id: xAxisId } = xAxes.newAxis({
      type: "category",
      gridId,
    });

    const { id: yAxisId } = yAxes.newAxis({
      type: "value",
      gridId,
    });

    series.newCartesianSeries(
      { datasetId: dsId, xAxisId, yAxisId },
      {
        type: "bar",
      },
    );

    const options = {
      dataset: datasets.exportDatasets(),
      grid: grids.exportGrids(),
      xAxis: xAxes.exportAxes(),
      yAxis: yAxes.exportAxes(),
      series: series.exportSeries(),
    };

    expect(options).toMatchInlineSnapshot(`
      {
        "dataset": [
          {
            "id": "dataset-1",
            "source": [
              [
                "name",
                "value",
              ],
              [
                "A",
                1,
              ],
              [
                "B",
                2,
              ],
            ],
          },
        ],
        "grid": [
          {
            "id": "grid-1",
          },
        ],
        "series": [
          {
            "datasetId": "dataset-1",
            "id": "series-1",
            "type": "bar",
            "xAxisId": "x-axis-1",
            "yAxisId": "y-axis-1",
          },
        ],
        "xAxis": [
          {
            "gridId": "grid-1",
            "id": "x-axis-1",
            "type": "category",
          },
        ],
        "yAxis": [
          {
            "gridId": "grid-1",
            "id": "y-axis-1",
            "type": "value",
          },
        ],
      }
    `);
  });
});
