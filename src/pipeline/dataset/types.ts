import { Primitive } from "@/core/types";

export interface DatasetSource {
  id: string;
  dimensions: string[];
  source: Primitive[][];
}

export interface DatasetFrom {
  id: string;
  fromDatasetId: string;
  transform: DatasetTransform[] | DatasetTransform;
}

export interface DatasetTransform {
  type: string;
  config: Record<string, any>;
}

export type DatasetDef = DatasetSource | DatasetFrom;
