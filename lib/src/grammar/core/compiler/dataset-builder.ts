import { andTransform, filterTransform } from "@/options-builder/builders";
import { DatasetTransform } from "@/options-builder/builders/types";
import { TCollectors } from "@/options-builder/collectors";

export function buildTransformedDataset(options: {
  collectors: TCollectors;
  datasetId: string;
  facetX: string | undefined;
  facetY: string | undefined;
  row: unknown;
  col: unknown;
}) {
  const { collectors, datasetId, facetX, facetY, row, col } = options;
  const filters = [] as DatasetTransform[];

  if (facetX) {
    filters.push(filterTransform(facetX, "=", row));
  }
  if (facetY) {
    filters.push(filterTransform(facetY, "=", col));
  }

  return collectors.datasets.newFromTransform(
    datasetId,
    andTransform(...filters),
    (table) =>
      table.filterRows((obj) => {
        if (facetX && facetY) {
          return obj[facetX] === row && obj[facetY] === col;
        }
        if (facetX) {
          return obj[facetX] === row;
        }
        if (facetY) {
          return obj[facetY] === col;
        }
        return true;
      }),
  );
}
