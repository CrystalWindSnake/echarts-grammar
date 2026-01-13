import { describe, it, expect } from "vitest";
import { compileOption } from "@/api/compile-option";
import { GrammarConfig } from "@/core/types";

describe("testing", () => {
  it("anying", () => {
    const data = [
      { region: "A", year: 2023, x: "foo", y: 1 },
      { region: "A", year: 2024, x: "foo", y: 2 },
      { region: "B", year: 2023, x: "foo", y: 3 },
    ];
    const config: GrammarConfig = {
      data: { type: "object-array", data },
      facet: { row: "region", col: "year" },
      marks: [{ type: "line", x: "x", y: "y" }],
    };

    const option = compileOption(config);

    expect(option).toMatchInlineSnapshot(`
      {
        "dataset": [
          {
            "dimensions": [
              "region",
              "year",
              "x",
              "y",
            ],
            "id": "ds0",
            "source": [
              [
                "A",
                2023,
                "foo",
                1,
              ],
              [
                "A",
                2024,
                "foo",
                2,
              ],
              [
                "B",
                2023,
                "foo",
                3,
              ],
            ],
          },
          {
            "fromDatasetId": "ds0",
            "id": "ds1",
            "transform": {
              "config": {
                "and": [
                  {
                    "=": "2023",
                    "dimension": "year",
                  },
                  {
                    "=": "A",
                    "dimension": "region",
                  },
                ],
              },
              "type": "filter",
            },
          },
          {
            "fromDatasetId": "ds0",
            "id": "ds2",
            "transform": {
              "config": {
                "and": [
                  {
                    "=": "2024",
                    "dimension": "year",
                  },
                  {
                    "=": "A",
                    "dimension": "region",
                  },
                ],
              },
              "type": "filter",
            },
          },
          {
            "fromDatasetId": "ds0",
            "id": "ds3",
            "transform": {
              "config": {
                "and": [
                  {
                    "=": "2023",
                    "dimension": "year",
                  },
                  {
                    "=": "B",
                    "dimension": "region",
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
              "2023",
              "A",
            ],
            "coordinateSystem": "matrix",
            "id": "gid-0",
          },
          {
            "coord": [
              "2024",
              "A",
            ],
            "coordinateSystem": "matrix",
            "id": "gid-1",
          },
          {
            "coord": [
              "2023",
              "B",
            ],
            "coordinateSystem": "matrix",
            "id": "gid-2",
          },
        ],
        "matrix": [
          {
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
                "2023",
                "2024",
              ],
              "itemStyle": {
                "borderWidth": 0,
              },
              "levelSize": 30,
              "show": true,
            },
            "y": {
              "data": [
                "A",
                "B",
              ],
              "itemStyle": {
                "borderWidth": 0,
              },
              "levelSize": 30,
              "show": false,
            },
          },
        ],
        "series": [
          {
            "datasetId": "ds1",
            "encode": {
              "x": "x",
              "y": "y",
            },
            "gridId": "gid-0",
            "id": "series-id-0",
            "type": "line",
            "xAxisId": "g-0-0",
            "yAxisId": "g-0-0",
          },
          {
            "datasetId": "ds2",
            "encode": {
              "x": "x",
              "y": "y",
            },
            "gridId": "gid-1",
            "id": "series-id-1",
            "type": "line",
            "xAxisId": "g-1-0",
            "yAxisId": "g-1-0",
          },
          {
            "datasetId": "ds3",
            "encode": {
              "x": "x",
              "y": "y",
            },
            "gridId": "gid-2",
            "id": "series-id-2",
            "type": "line",
            "xAxisId": "g-2-0",
            "yAxisId": "g-2-0",
          },
        ],
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
          {
            "axisLine": {
              "show": false,
            },
            "gridId": "gid-2",
            "id": "g-2-0",
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
          {
            "axisLine": {
              "show": false,
            },
            "gridId": "gid-2",
            "id": "g-2-0",
            "name": "↑ y",
            "show": true,
            "type": "value",
          },
        ],
      }
    `);
  });
});
