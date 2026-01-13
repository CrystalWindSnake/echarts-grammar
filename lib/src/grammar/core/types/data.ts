import { Primitive } from "./base";

export type DataSource = ObjectArrayDataSource | MatrixDataSource;

export interface ObjectArrayDataSource {
  type: "object-array";
  data: Record<string, Primitive>[];
}

export interface MatrixDataSource {
  type: "matrix";
  data: Primitive[][];
  dimensions?: string[];
}

export interface NormalizedDataset {
  dimensions: string[];
  rows: Primitive[][];
}
