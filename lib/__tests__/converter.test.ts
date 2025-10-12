import { describe, expect, test } from "vitest";
import { convertToECharts } from "@/converter";
import { GrammarConfig } from "@/types";
import type { TResult } from "./types";
import * as consts from "@/consts";

describe("charts", () => {
  test("should convert bar chart", () => {
    const config: GrammarConfig = {
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
          data: [
            { x: "A", y: 10 },
            { x: "B", y: 20 },
            { x: "C", y: 30 },
          ],
        },
      ],
    };

    const { dataset, series, xAxis, yAxis, grid, matrix } = convertToECharts(
      config
    ) as TResult;

    // expect dataset
    expect(dataset).toEqual([
      expect.objectContaining({
        id: expect.anything(),
        dimensions: ["x", "y"],
        source: [
          ["A", 10],
          ["B", 20],
          ["C", 30],
        ],
      }),
    ]);

    // expect series
    expect(series).toEqual([
      expect.objectContaining({
        type: "bar",
        encode: { x: "x", y: "y" },
        datasetId: expect.anything(),
        xAxisId: expect.anything(),
        yAxisId: expect.anything(),
      }),
    ]);

    expect(series[0].datasetId).toBe(dataset[0].id);
    expect(series[0].xAxisId).toBe(xAxis[0].id);
    expect(series[0].yAxisId).toBe(yAxis[0].id);

    // the series cannot have data property, otherwise it will invalidate the dataset
    expect(series).not.toEqual([
      expect.objectContaining({ data: expect.anything() }),
    ]);

    // expect xAxis and yAxis
    expect(xAxis).toEqual([
      expect.objectContaining({ type: "category", gridId: expect.anything() }),
    ]);

    expect(yAxis).toEqual([
      expect.objectContaining({ type: "value", gridId: expect.anything() }),
    ]);

    // the grid's id should is the same as xAxis, yAxis's gridId
    expect(xAxis[0].gridId).toBe(grid[0].id);
    expect(yAxis[0].gridId).toBe(grid[0].id);

    // expect matrix
    expect(matrix).toBeUndefined();
  });

  test("should convert line chart", () => {
    const config: GrammarConfig = {
      marks: [
        {
          type: "line",
          x: "x",
          y: "y",
          data: [
            { x: "A", y: 10 },
            { x: "B", y: 20 },
            { x: "C", y: 30 },
          ],
        },
      ],
    };

    const result = convertToECharts(config) as TResult;
    const { series, xAxis, yAxis } = result;

    // expect series
    expect(series).toEqual([
      expect.objectContaining({
        type: "line",
        encode: { x: "x", y: "y" },
        datasetId: expect.anything(),
        xAxisId: expect.anything(),
        yAxisId: expect.anything(),
      }),
    ]);

    // expect xAxis and yAxis
    expect(xAxis).toEqual([
      expect.objectContaining({ type: "category", gridId: expect.anything() }),
    ]);

    expect(yAxis).toEqual([
      expect.objectContaining({ type: "value", gridId: expect.anything() }),
    ]);
  });

  test("should convert line chart by color", () => {
    const config: GrammarConfig = {
      marks: [
        {
          type: "line",
          x: "x",
          y: "y",
          color: "color",
          data: [
            { x: "A", y: 10, color: "c1" },
            { x: "B", y: 20, color: "c1" },
            { x: "A", y: 20, color: "c2" },
            { x: "B", y: 30, color: "c2" },
          ],
        },
      ],
    };

    const result = convertToECharts(config) as TResult;
    const { series, dataset } = result;

    // expect dataset
    expect(dataset).toEqual([
      expect.any(Object),
      expect.objectContaining({
        transform: expect.objectContaining({
          config: {
            and: [
              {
                "=": "c1",
                dimension: "color",
              },
            ],
          },
        }),
      }),
      expect.objectContaining({
        transform: expect.objectContaining({
          config: {
            and: [
              {
                "=": "c2",
                dimension: "color",
              },
            ],
          },
        }),
      }),
    ]);

    // expect series
    expect(series.length).toBe(2);
  });

  test("should convert pie chart", () => {
    const config: GrammarConfig = {
      marks: [
        {
          type: "pie",
          name: "x",
          value: "y",
          data: [
            { x: "A", y: 10 },
            { x: "B", y: 20 },
          ],
        },
      ],
    };

    const result = convertToECharts(config) as TResult;
    const { series, xAxis, yAxis } = result;

    // expect series
    expect(series).toEqual([
      expect.objectContaining({
        type: "pie",
        encode: { name: "x", value: "y" },
        datasetId: expect.anything(),
      }),
    ]);

    // expect xAxis and yAxis
    expect(xAxis).toBeUndefined();
    expect(yAxis).toBeUndefined();
  });

  test("should convert scatter chart", () => {
    const config: GrammarConfig = {
      marks: [
        {
          type: "scatter",
          x: "x",
          y: "y",
          data: [
            { x: 10, y: 10 },
            { x: 15, y: 20 },
            { x: 20, y: 30 },
          ],
        },
      ],
    };

    const result = convertToECharts(config) as TResult;
    const { series, xAxis, yAxis } = result;

    // expect series
    expect(series).toEqual([
      expect.objectContaining({
        encode: {
          x: "x",
          y: "y",
        },
        type: "scatter",
      }),
    ]);

    // expect xAxis and yAxis
    expect(xAxis).toEqual([expect.objectContaining({ type: "value" })]);

    expect(yAxis).toEqual([expect.objectContaining({ type: "value" })]);
  });

  test("should convert scatter chart by color", () => {
    const config: GrammarConfig = {
      marks: [
        {
          type: "scatter",
          x: "x",
          y: "y",
          color: "color",
          data: [
            { x: 10, y: 10, color: "c1" },
            { x: 15, y: 20, color: "c1" },
            { x: 20, y: 20, color: "c2" },
            { x: 35, y: 30, color: "c2" },
          ],
        },
      ],
    };

    const result = convertToECharts(config) as TResult;
    const { series, dataset } = result;

    // expect dataset
    expect(dataset).toEqual([
      expect.any(Object),
      expect.objectContaining({
        transform: expect.objectContaining({
          config: {
            and: [
              {
                "=": "c1",
                dimension: "color",
              },
            ],
          },
        }),
      }),
      expect.objectContaining({
        transform: expect.objectContaining({
          config: {
            and: [
              {
                "=": "c2",
                dimension: "color",
              },
            ],
          },
        }),
      }),
    ]);

    // expect series
    expect(series.length).toBe(2);
  });

  test("should setting global data for multiple charts", () => {
    const config: GrammarConfig = {
      data: [
        { x: "A", y: 10 },
        { x: "B", y: 20 },
      ],
      marks: [
        {
          type: "bar",
        },
        {
          type: "line",
        },
      ],
    };

    const result = convertToECharts(config) as TResult;
    const { dataset } = result;

    expect(dataset.length).toBe(1);
  });
});

describe("series options", () => {
  test("should set series options", () => {
    const config: GrammarConfig = {
      marks: [
        {
          type: "line",
          data: [
            { x: "A", y: 10 },
            { x: "B", y: 20 },
          ],
          echarts: {
            smooth: true,
          },
        },
      ],
    };

    const { series } = convertToECharts(config) as TResult;

    expect(series).toEqual([
      expect.objectContaining({
        type: "line",
        smooth: true,
      }),
    ]);
  });
});

describe("test facet", () => {
  test("should chart with facet by row", () => {
    const config: GrammarConfig = {
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
          data: [
            { x: "A", y: 10, cat: "X" },
            { x: "B", y: 20, cat: "X" },
            { x: "C", y: 15, cat: "Y" },
            { x: "D", y: 25, cat: "Y" },
          ],
          facet: {
            row: "cat",
          },
        },
      ],
    };

    const result = convertToECharts(config) as TResult;
    const { dataset, series, grid } = result;

    // expect dataset
    expect(dataset).toEqual([
      {
        dimensions: ["x", "y", "cat"],
        id: expect.any(String),
        source: expect.any(Array),
      },
      {
        fromDatasetId: expect.any(String),
        id: expect.any(String),
        transform: {
          config: {
            and: [
              {
                "=": "X",
                dimension: "cat",
              },
            ],
          },
          type: "filter",
        },
      },
      {
        fromDatasetId: expect.any(String),
        id: expect.any(String),
        transform: {
          config: {
            and: [
              {
                "=": "Y",
                dimension: "cat",
              },
            ],
          },
          type: "filter",
        },
      },
    ]);

    expect(dataset[1].fromDatasetId).toBe(dataset[0].id);
    expect(dataset[2].fromDatasetId).toBe(dataset[0].id);

    // expect matrix

    expect(result.matrix).toEqual(
      expect.objectContaining({
        x: expect.objectContaining({
          data: ["X", "Y"],
        }),
        y: expect.objectContaining({
          data: [consts.matrix_data_default],
        }),
      })
    );

    // expect grid
    expect(grid).toEqual([
      expect.objectContaining({
        coord: ["X", consts.matrix_data_default],
      }),
      expect.objectContaining({
        coord: ["Y", consts.matrix_data_default],
      }),
    ]);

    // expect series
    expect(series[0].datasetId).toBe(dataset[1].id);
    expect(series[1].datasetId).toBe(dataset[2].id);
  });

  test("should chart with facet by row and column", () => {
    const config: GrammarConfig = {
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
          data: [
            { x: "g1", y: 10, cat: "X", subcat: "A" },
            { x: "g2", y: 20, cat: "X", subcat: "A" },

            { x: "g1", y: 10, cat: "X", subcat: "B" },
            { x: "g2", y: 20, cat: "X", subcat: "B" },

            { x: "g1", y: 10, cat: "Y", subcat: "A" },
            { x: "g2", y: 20, cat: "Y", subcat: "A" },

            { x: "g1", y: 10, cat: "Y", subcat: "B" },
            { x: "g2", y: 20, cat: "Y", subcat: "B" },
          ],
          facet: {
            row: "cat",
            column: "subcat",
          },
        },
      ],
    };

    const result = convertToECharts(config) as TResult;
    const { matrix, grid } = result;

    // expect matrix
    expect(matrix).toEqual(
      expect.objectContaining({
        x: expect.objectContaining({
          data: ["X", "Y"],
          show: true,
        }),
        y: expect.objectContaining({
          data: ["A", "B"],
          show: true,
        }),
      })
    );

    // expect grid
    expect(grid.length).toBe(4);
    expect(result).toEqual(
      expect.objectContaining({
        grid: expect.arrayContaining([
          expect.objectContaining({ coord: ["X", "A"] }),
          expect.objectContaining({ coord: ["X", "B"] }),
          expect.objectContaining({ coord: ["Y", "A"] }),
          expect.objectContaining({ coord: ["Y", "B"] }),
        ]),
      })
    );
  });

  test("should facet in cases of multiple charts", () => {
    const config: GrammarConfig = {
      marks: [
        {
          type: "bar",
          x: "x",
          y: "y",
          data: [
            { x: "A", y: 10, cat: "X" },
            { x: "B", y: 20, cat: "X" },
            { x: "C", y: 15, cat: "Y" },
            { x: "D", y: 25, cat: "Y" },
          ],
          facet: {
            row: "cat",
          },
        },
        {
          type: "line",
          x: "x",
          y: "y",
          data: [
            { x: "A", y: 15, cat: "X" },
            { x: "B", y: 25, cat: "X" },
            { x: "C", y: 20, cat: "Y" },
            { x: "D", y: 30, cat: "Y" },
          ],
          facet: {
            row: "cat",
          },
        },
      ],
    };

    const result = convertToECharts(config) as TResult;
    const { series, grid, matrix, xAxis, yAxis } = result;

    // expect matrix

    expect(matrix).toEqual(
      expect.objectContaining({
        x: expect.objectContaining({
          data: ["X", "Y"],
        }),
        y: expect.objectContaining({
          data: [consts.matrix_data_default],
        }),
      })
    );

    // expect grid
    expect(grid).toEqual([
      expect.objectContaining({
        coord: ["X", consts.matrix_data_default],
      }),
      expect.objectContaining({
        coord: ["Y", consts.matrix_data_default],
      }),
    ]);

    // expect series
    expect(series.length).toBe(4);
    expect(series.filter((s) => s.type === "bar").length).toBe(2);
    expect(series.filter((s) => s.type === "line").length).toBe(2);

    // expect xAxis and yAxis
    expect(xAxis).toEqual([
      expect.objectContaining({
        type: "category",
      }),
      expect.objectContaining({
        type: "category",
      }),
    ]);

    expect(yAxis).toEqual([
      expect.objectContaining({
        type: "value",
      }),
      expect.objectContaining({
        type: "value",
      }),
    ]);
  });
});

describe("testing", () => {
  test("anying", () => {
    const config: GrammarConfig = {
      marks: [
        {
          type: "line",
          // label: "cat",
          tooltip: ["cat", "x", "y"],
          x: "cat",
          y: "y",
          data: [
            { x: 10, y: 10, cat: "X1" },
            { x: 20, y: 20, cat: "X2" },
            { x: 15, y: 15, cat: "Y1" },
            { x: 25, y: 25, cat: "Y2" },
          ],
        },
      ],
    };

    const result = convertToECharts(config) as TResult;
    expect(result).toMatchInlineSnapshot(`
      {
        "dataset": [
          {
            "dimensions": [
              "x",
              "y",
              "cat",
            ],
            "id": "ds0",
            "source": [
              [
                10,
                10,
                "X1",
              ],
              [
                20,
                20,
                "X2",
              ],
              [
                15,
                15,
                "Y1",
              ],
              [
                25,
                25,
                "Y2",
              ],
            ],
          },
        ],
        "grid": [
          {
            "id": "gid-0",
          },
        ],
        "matrix": undefined,
        "series": [
          {
            "datasetId": "ds0",
            "encode": {
              "tooltip": [
                "cat",
                "x",
                "y",
              ],
              "x": "cat",
              "y": "y",
            },
            "showSymbol": false,
            "type": "line",
            "xAxisId": "g-0-0",
            "yAxisId": "g-0-0",
          },
        ],
        "tooltip": {
          "trigger": "axis",
        },
        "xAxis": [
          {
            "gridId": "gid-0",
            "id": "g-0-0",
            "show": true,
            "type": "category",
          },
        ],
        "yAxis": [
          {
            "gridId": "gid-0",
            "id": "g-0-0",
            "show": true,
            "type": "value",
          },
        ],
      }
    `);
  });
});
