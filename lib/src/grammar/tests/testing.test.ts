import { describe, it, expect } from "vitest";
import { compileOption } from "@/grammar/api/compile-option";
import { GrammarConfig } from "@/grammar/core/types";

describe("testing", () => {
  it("anying", () => {
    const data = [
      { label: "A", year: 2023, x: "foo", y: 1 },
      { label: "A", year: 2023, x: "bar", y: 2 },
      { label: "B", year: 2024, x: "foo", y: 10 },
      { label: "B", year: 2024, x: "bar", y: 20 },
    ];
    const config: GrammarConfig = {
      data: { type: "object-array", data },
      // facet: { row: "region", col: "year" },
      marks: [{ type: "bar", x: "x", y: "y", color: "label" }],
    };

    const option = compileOption(config);

    expect(option).toMatchInlineSnapshot(`
      {
        "dataset": [
          {
            "dimensions": [
              "label",
              "year",
              "x",
              "y",
            ],
            "id": "ds_1",
            "source": [
              [
                "A",
                2023,
                "foo",
                1,
              ],
              [
                "A",
                2023,
                "bar",
                2,
              ],
              [
                "B",
                2024,
                "foo",
                10,
              ],
              [
                "B",
                2024,
                "bar",
                20,
              ],
            ],
          },
          {
            "dimensions": [
              "label",
              "year",
              "x",
              "y",
            ],
            "id": "ds_2",
            "source": [
              [
                "A",
                2023,
                "foo",
                1,
              ],
              [
                "A",
                2023,
                "bar",
                2,
              ],
            ],
          },
          {
            "dimensions": [
              "label",
              "year",
              "x",
              "y",
            ],
            "id": "ds_3",
            "source": [
              [
                "B",
                2024,
                "foo",
                10,
              ],
              [
                "B",
                2024,
                "bar",
                20,
              ],
            ],
          },
        ],
        "grid": [
          {
            "id": "gid-0",
          },
        ],
        "series": [
          {
            "datasetId": "ds_2",
            "encode": {
              "x": "x",
              "y": "y",
            },
            "id": "series-id-0",
            "name": "A",
            "type": "bar",
            "xAxisId": "g-0-0",
            "yAxisId": "g-0-0",
          },
          {
            "datasetId": "ds_3",
            "encode": {
              "x": "x",
              "y": "y",
            },
            "id": "series-id-1",
            "name": "B",
            "type": "bar",
            "xAxisId": "g-0-0",
            "yAxisId": "g-0-0",
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
        ],
      }
    `);
  });
});
