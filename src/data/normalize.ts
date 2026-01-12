import { DataSource, NormalizedDataset } from "@/core/types";
import { DataAdapter } from "@/data/data-source";
import { ObjectArrayAdapter } from "@/data/adapters/object-array-adapter";
import { MatrixAdapter } from "@/data/adapters/matrix-adapter";

const adapters: DataAdapter[] = [new ObjectArrayAdapter(), new MatrixAdapter()];

export function normalizeDataSource(ds: DataSource): NormalizedDataset {
  const adapter = adapters.find((a) => a.canHandle(ds));
  if (!adapter) {
    throw new Error("Unsupported data source type");
  }
  return adapter.normalize(ds);
}
