import { GrammarConfig } from "@/grammar/core/types";
import { validateConfig } from "@/grammar/core/validator";
import { seriesFactory } from "@/grammar/pipeline/series";
import { buildGrid } from "./grid-builder";
import { buildMatrix } from "./matrix-builder";
import { createCollectors } from "@/options-builder/collectors";
import { buildTransformedDataset } from "./dataset-builder";

export function compile(config: GrammarConfig): any {
  validateConfig(config);

  if (config.facet) {
    return compileFacet(config);
  }

  return compileNonFacet(config);
}

function compileFacet(config: GrammarConfig) {
  const { data: dataSource } = config;
  if (!dataSource) throw new Error("facet requires global data");

  const collectors = createCollectors();
  const { id: dsId } =
    dataSource.type === "matrix"
      ? collectors.datasets.newFromMatrixSource(dataSource.data)
      : collectors.datasets.newFromObjectArraySource(dataSource.data);

  const dataTable = collectors.datasets.getResolvedData(dsId);

  const { id: matrixId } = buildMatrix(collectors, dataTable, config.facet!);

  const facetXValues = !!config.facet!.row
    ? dataTable.column(config.facet!.row, true)
    : ["-1"];
  const facetYValues = !!config.facet!.col
    ? dataTable.column(config.facet!.col, true)
    : ["-1"];

  for (const [rowIndex, row] of facetXValues.entries()) {
    for (const [colIndex, col] of facetYValues) {
      const { id: gridId } = buildGrid({
        collectors,
        matrixId,
        row,
        col,
      });

      const { id: dsTfId } = buildTransformedDataset({
        collectors,
        datasetId: dsId,
        facetX: config.facet!.row,
        facetY: config.facet!.col,
        row,
        col,
      });

      const matrixCtx = {
        rowIndex,
        colIndex,
      };

      for (const mark of config.marks) {
        const sStrategy = seriesFactory.getStrategy(mark.type);
        sStrategy.build(
          {
            collectors,
            datasetId: dsTfId,
            gridId,
            themeColors: [
              "#5470c6",
              "#91cc75",
              "#fac858",
              "#ee6666",
              "#73c0de",
              "#3ba272",
              "#fc8452",
              "#9a60b4",
              "#ea7ccc",
            ],
            matrixCtx,
          },
          mark,
        );
      }
    }
  }

  return collectors.exportOptions();
}

function compileNonFacet(config: GrammarConfig) {
  const { data: dataSource } = config;
  if (!dataSource) throw new Error("facet requires global data");

  const collectors = createCollectors();
  const { id: dsId } =
    dataSource.type === "matrix"
      ? collectors.datasets.newFromMatrixSource(dataSource.data)
      : collectors.datasets.newFromObjectArraySource(dataSource.data);

  const { id: gridId } = collectors.grids.newGrid();

  for (const mark of config.marks) {
    const sStrategy = seriesFactory.getStrategy(mark.type);
    sStrategy.build(
      {
        collectors,
        datasetId: dsId,
        gridId,
        themeColors: [
          "#5470c6",
          "#91cc75",
          "#fac858",
          "#ee6666",
          "#73c0de",
          "#3ba272",
          "#fc8452",
          "#9a60b4",
          "#ea7ccc",
        ],
      },
      mark,
    );
  }

  return collectors.exportOptions();
}
