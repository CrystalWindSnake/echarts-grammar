import { DataSource, NormalizedDataset } from "@/core/types";

export interface DataAdapter {
  canHandle(ds: DataSource): boolean;
  normalize(ds: DataSource): NormalizedDataset;
}
