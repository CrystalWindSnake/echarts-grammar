import { DataAdapter } from "../data-source";
import {
  DataSource,
  NormalizedDataset,
  ObjectArrayDataSource,
} from "../../core/types";

export class ObjectArrayAdapter implements DataAdapter {
  canHandle(ds: DataSource): boolean {
    return ds.type === "object-array";
  }

  normalize(ds: ObjectArrayDataSource): NormalizedDataset {
    if (ds.data.length === 0) {
      return { dimensions: [], rows: [] };
    }

    const dimensions = Object.keys(ds.data[0]);
    const rows = ds.data.map((row) => dimensions.map((d) => row[d]));

    return { dimensions, rows };
  }
}
