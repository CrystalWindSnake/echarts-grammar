import { GrammarConfig } from "@/core/types";
import { normalizeDataSource } from "@/data/normalize";
import { genDatasetId, genSeriesId } from "@/core/id-generator";
import { buildTransformDataset } from "@/data/slice-transform";

export function buildMatrix(config: GrammarConfig) {
  const rawDS = normalizeDataSource(config.data!);
  const rawId = genDatasetId();

  const dims = Array.isArray(config.facet!.by)
    ? config.facet!.by
    : [config.facet!.by];

  const uniqueValues = (rawDS.rows || []).reduce((acc, row) => {
    const key = dims.map((d) => row[rawDS.dimensions.indexOf(d)]);
    acc.add(key.join("|"));
    return acc;
  }, new Set<string>());

  const cells = [];
  const datasets: any[] = [
    { id: rawId, dimensions: rawDS.dimensions, source: rawDS.rows },
  ];

  let dsIndex = 1;
  for (const combo of Array.from(uniqueValues.values())) {
    const parts = combo.split("|");
    const filters = dims.map((d, i) => ({ field: d, value: parts[i] }));

    // Dataset transform
    const transformDsId = genDatasetId();

    datasets.push(buildTransformDataset(transformDsId, dims[0], parts[0], 0));

    // Series
    const sId = genSeriesId();
    cells.push({
      row: 0,
      col: dsIndex - 1,
      seriesId: sId,
      datasetIndex: dsIndex,
    });

    dsIndex++;
  }

  return { datasets, cells };
}
