import {
  DataSource,
  MatrixDataSource,
  NormalizedDataset,
  ObjectArrayDataSource,
} from "@/grammar/core/types";

export function normalizeDataSource(ds: DataSource): NormalizedDataset {
  switch (ds.type) {
    case "matrix":
      return matrixNormalize(ds);

    case "object-array":
      return objectArrayNormalize(ds);

    default:
      throw new Error("Unsupported data source type");
  }
}

function objectArrayNormalize(ds: ObjectArrayDataSource): NormalizedDataset {
  if (ds.data.length === 0) {
    return { dimensions: [], rows: [] };
  }

  const dimensions = Object.keys(ds.data[0]);
  const rows = ds.data.map((row) => dimensions.map((d) => row[d]));

  return { dimensions, rows };
}

function matrixNormalize(ds: MatrixDataSource): NormalizedDataset {
  if (!ds.dimensions) {
    const width = ds.data[0]?.length ?? 0;
    const dimensions = Array.from({ length: width }).map((_, i) => `dim${i}`);
    return { dimensions, rows: ds.data };
  }

  return { dimensions: ds.dimensions, rows: ds.data };
}
