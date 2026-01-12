import { DataSource, DatasetBuildResult } from "@/core/types";
import { normalizeDataSource } from "@/data/normalize";
import { genDatasetId } from "@/core/id-generator";

export function buildDataset(ds: DataSource): DatasetBuildResult {
  const normalized = normalizeDataSource(ds);

  const id = genDatasetId();

  return {
    id,
    dataset: {
      id,
      dimensions: normalized.dimensions,
      source: normalized.rows,
    },
  };
}
