import { DatasetTransform } from "./types";

/** = > < >= <= */
export function filterTransform(
  field: string,
  op: "=" | ">" | "<" | ">=" | "<=",
  value: any,
): DatasetTransform {
  return {
    type: "filter",
    config: {
      dimension: field,
      [op]: value,
    },
  };
}

/** and 组合 */
export function andTransform(...filters: DatasetTransform[]): DatasetTransform {
  return {
    type: "filter",
    config: {
      and: filters.map((f) => f.config),
    },
  };
}

/** or 组合 */
export function orTransform(...filters: DatasetTransform[]): DatasetTransform {
  return {
    type: "filter",
    config: {
      or: filters.map((f) => f.config),
    },
  };
}
