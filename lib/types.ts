import type { EChartsOption } from "echarts";

export interface GrammarConfig {
  data?: Dataset;
  facet?: FacetConfig;
  marks: MarkConfig[];
  echartsOptions?: EChartsOption;
}

type RequireData<T extends { data?: any }> = Omit<T, "data"> & {
  data: DatasetSourceWithDim;
};

export type NormalizedMarkConfig<T extends BaseMarkConfig> = RequireData<T>;

export type StrictMarkConfig = NormalizedMarkConfig<BaseMarkConfig>;

export interface NormalizedGrammarConfig {
  facetInfo: FacetInfo;
  marks: StrictMarkConfig[];
  echartsOptions?: EChartsOption;
}

export interface DatasetSourceWithDim {
  dimensions: string[];
  source: any[][];
}

export type DatasetSourceRecord = Record<string, any>[];
export type DatasetSource = DatasetSourceWithDim | DatasetSourceRecord;

type DatasetDataFn = () => DatasetSource;
export type Dataset = DatasetSource | DatasetDataFn;

// facet config
export interface FacetConfig {
  row?: string;
  column?: string;
  wrap?: number;
}

export interface FacetInfo {
  rowValues: string[];
  columnValues: string[];
}

// chart config

export interface BaseMarkConfig {
  type: string;
  data?: Dataset;
  facet?: FacetConfig;
  echarts?: Record<string, any>;
}

export type MarkConfig =
  | BarMarkConfig
  | LineMarkConfig
  | PieMarkConfig
  | ScatterMarkConfig;

export interface BarMarkConfig extends BaseMarkConfig {
  type: "bar";
  x?: string;
  y?: string;
  label?: string | string[];
  tooltip?: string | string[];
}

export interface LineMarkConfig extends BaseMarkConfig {
  type: "line";
  x?: string;
  y?: string;
  color?: string;
  label?: string | string[];
  tooltip?: string | string[];
}

export interface PieMarkConfig extends BaseMarkConfig {
  type: "pie";
  name?: string;
  value?: string;
  tooltip?: string | string[];
}

export interface ScatterMarkConfig extends BaseMarkConfig {
  type: "scatter";
  x?: string;
  y?: string;
  color?: string;
  size?: string;
  label?: string | string[];
  tooltip?: string | string[];
}
