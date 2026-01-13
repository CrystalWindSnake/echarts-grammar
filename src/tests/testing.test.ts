import { describe, it, expect } from "vitest";
import { compileOption } from "@/api/compile-option";
import { GrammarConfig } from "@/core/types";

describe("testing", () => {
  it("anying", () => {
    const data = [
      { label: "A", year: 2023, x: "foo", y: 1 },
      { label: "B", year: 2024, x: "bar", y: 2 },
    ];
    const config: GrammarConfig = {
      data: { type: "object-array", data },
      // facet: { row: "region", col: "year" },
      marks: [{ type: "bar", x: "x", y: "y", label: "label" }],
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
            "id": "ds0",
            "source": [
              [
                "A",
                2023,
                "foo",
                1,
              ],
              [
                "B",
                2024,
                "bar",
                2,
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
            "datasetId": "ds0",
            "encode": {
              "label": "label",
              "x": "x",
              "y": "y",
            },
            "id": "series-id-0",
            "label": {
              "position": "insideTop",
              "show": true,
            },
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
