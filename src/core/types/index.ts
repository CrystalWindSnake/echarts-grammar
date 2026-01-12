export type Primitive = string | number | boolean | null;

export interface GrammarConfig {
  data?: DataSource;
  marks: MarkConfig[];
  echarts?: Record<string, any>;
}

export interface MarkConfig {
  id?: string;
  type: string;
  data?: DataSource;
  x: string;
  y: string;
  options?: Record<string, any>;
}

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

export interface DatasetBuildResult {
  id: string;
  dataset: any;
}

export interface FacetConfig {
  by: string | string[];
  order?: "asc" | "desc";
}

export interface GrammarConfig {
  data?: DataSource;
  facet?: FacetConfig;
  marks: MarkConfig[];
  echarts?: Record<string, any>;
}
