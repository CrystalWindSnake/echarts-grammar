import { DataAdapter } from "@/data/data-source";
import { DataSource, NormalizedDataset, MatrixDataSource } from "@/core/types";

export class MatrixAdapter implements DataAdapter {
  canHandle(ds: DataSource): boolean {
    return ds.type === "matrix";
  }

  normalize(ds: MatrixDataSource): NormalizedDataset {
    if (!ds.dimensions) {
      const width = ds.data[0]?.length ?? 0;
      const dimensions = Array.from({ length: width }).map((_, i) => `dim${i}`);
      return { dimensions, rows: ds.data };
    }

    return { dimensions: ds.dimensions, rows: ds.data };
  }
}
