import { describe, expect, test } from "vitest";
import { convertToECharts } from "@/converter";
import { GrammarConfig } from "@/types";
import type { TResult } from "./types";

describe("testing", () => {
  test("anying", () => {
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
                "A",
                10,
                "X",
              ],
              [
                "B",
                20,
                "X",
              ],
              [
                "C",
                15,
                "Y",
              ],
              [
                "D",
                25,
                "Y",
              ],
            ],
          },
          {
            "fromDatasetId": "ds0",
            "id": "ds0-cat-=-X",
            "transform": {
              "config": {
                "and": [
                  {
                    "=": "X",
                    "dimension": "cat",
                  },
                ],
              },
              "type": "filter",
            },
          },
          {
            "fromDatasetId": "ds0",
            "id": "ds0-cat-=-Y",
            "transform": {
              "config": {
                "and": [
                  {
                    "=": "Y",
                    "dimension": "cat",
                  },
                ],
              },
              "type": "filter",
            },
          },
        ],
        "grid": [
          {
            "coord": [
              "X",
              "-1",
            ],
            "coordinateSystem": "matrix",
            "id": "gid-0",
          },
          {
            "coord": [
              "Y",
              "-1",
            ],
            "coordinateSystem": "matrix",
            "id": "gid-1",
          },
        ],
        "matrix": {
          "backgroundStyle": {
            "borderWidth": 0,
          },
          "body": {
            "itemStyle": {
              "borderWidth": 0,
            },
          },
          "x": {
            "data": [
              "X",
              "Y",
            ],
            "itemStyle": {
              "borderWidth": 0,
            },
            "levelSize": 30,
            "show": true,
          },
          "y": {
            "data": [
              "-1",
            ],
            "itemStyle": {
              "borderWidth": 0,
            },
            "levelSize": 30,
            "show": false,
          },
        },
        "series": [
          {
            "datasetId": "ds0-cat-=-X",
            "encode": {
              "x": "x",
              "y": "y",
            },
            "id": "series-id-0",
            "type": "bar",
            "xAxisId": "g-0-0",
            "yAxisId": "g-0-0",
          },
          {
            "datasetId": "ds0-cat-=-Y",
            "encode": {
              "x": "x",
              "y": "y",
            },
            "id": "series-id-1",
            "type": "bar",
            "xAxisId": "g-1-0",
            "yAxisId": "g-1-0",
          },
        ],
        "tooltip": {
          "trigger": "axis",
        },
        "visualMap": [],
        "xAxis": [
          {
            "axisLine": {
              "show": false,
            },
            "gridId": "gid-0",
            "id": "g-0-0",
            "name": "x →",
            "show": true,
            "type": "category",
          },
          {
            "axisLine": {
              "show": false,
            },
            "gridId": "gid-1",
            "id": "g-1-0",
            "name": "x →",
            "show": true,
            "type": "category",
          },
        ],
        "yAxis": [
          {
            "axisLine": {
              "show": false,
            },
            "gridId": "gid-0",
            "id": "g-0-0",
            "name": "↑ y",
            "show": true,
            "type": "value",
          },
          {
            "axisLine": {
              "show": false,
            },
            "gridId": "gid-1",
            "id": "g-1-0",
            "name": "↑ y",
            "show": true,
            "type": "value",
          },
        ],
      }
    `);
  });
});

const opt = {
  dataset: [
    {
      dimensions: ["x", "y"],
      id: "ds0",
      source: [
        ["foo", 10],
        ["bar", 20],
      ],
    },
  ],
  grid: [
    {
      id: "gid-0",
    },
  ],
  matrix: undefined,
  series: [
    {
      datasetId: "ds0",
      encode: {
        x: "x",
        y: "y",
      },
      id: "series-id-0",
      type: "bar",
      xAxisId: "g-0-0",
      yAxisId: "g-0-0",
    },
  ],
  xAxis: [
    {
      axisLine: {
        show: false,
      },
      gridId: "gid-0",
      id: "g-0-0",
      name: "x →",
      show: true,
      type: "category",
    },
  ],
  yAxis: [
    {
      axisLine: {
        show: false,
      },
      gridId: "gid-0",
      id: "g-0-0",
      name: "↑ y",
      show: true,
      type: "value",
    },
  ],
};
