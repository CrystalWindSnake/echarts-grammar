import { GrammarConfig } from "@/core/types";
import { genGridId } from "@/core/id-generator";
import type { DataPipeline } from "@/pipeline/dataset/pipeline";
import { andTransform, filterTransform } from "@/pipeline/dataset/transforms";

export interface MatrixSeriesMeta {
  gridId: string;
  datasetId: string;
  axisId?: string;
}

export interface MatrixBuildResult {
  matrix: any;
  grids: any[];
  xAxisArr: any[];
  yAxisArr: any[];
  seriesMetas: MatrixSeriesMeta[];
}

const DEFAULT_MATRIX_CONFIG = {
  MATRIX: {
    backgroundStyle: {
      borderWidth: 0,
    },
    body: {
      itemStyle: {
        borderWidth: 0,
      },
    },
  },
  X: {
    itemStyle: {
      borderWidth: 0,
    },
    levelSize: 30,
    show: true,
  },
  Y: {
    itemStyle: {
      borderWidth: 0,
    },
    levelSize: 30,
    show: false,
  },
};

export interface MatrixCtx {
  datasetPipeline: DataPipeline;
}

export function buildMatrix(
  config: GrammarConfig,
  ctx: MatrixCtx
): MatrixBuildResult {
  const { datasetPipeline } = ctx;
  const rawDSId = datasetPipeline.createDatasetFromSource(config.data!);
  const rawDS = datasetPipeline.getDatasetSource(rawDSId);

  const colField = config.facet!.col ?? null;
  const rowField = config.facet!.row ?? null;
  const is2D = !!(colField && rowField);

  const xField = colField ?? rowField!;
  const yField = is2D ? rowField : null;

  const xIndex = rawDS.dimensions.indexOf(xField);
  const yIndex = yField ? rawDS.dimensions.indexOf(yField) : -1;

  const xValues: string[] = [];
  const yValues: string[] = [];

  const comboSet = new Set<string>();

  for (const row of rawDS.source || []) {
    const xv = String(row[xIndex]);
    const yv = yField ? String(row[yIndex]) : "-1";

    if (!xValues.includes(xv)) xValues.push(xv);
    if (!yValues.includes(yv)) yValues.push(yv);

    comboSet.add(`${xv}||${yv}`);
  }

  if (yValues.length === 0) yValues.push("-1");

  const matrix = {
    x: { data: xValues, ...DEFAULT_MATRIX_CONFIG.X },
    y: { data: yValues, ...DEFAULT_MATRIX_CONFIG.Y },
    ...DEFAULT_MATRIX_CONFIG.MATRIX,
  };

  const grids: any[] = [];
  const xAxisArr: any[] = [];
  const yAxisArr: any[] = [];
  const seriesMetas: MatrixSeriesMeta[] = [];

  for (const key of comboSet) {
    const [xv, yv] = key.split("||");

    // 1. grid
    const gridId = genGridId();

    grids.push({
      id: gridId,
      coordinateSystem: "matrix",
      coord: [xv, yv],
    });

    // 2. dataset transform (组合条件)
    const conditions = [{ field: xField, value: xv }];

    if (is2D) {
      conditions.push({ field: yField!, value: yv });
    }

    const tfs = andTransform(
      ...conditions.map((c) => filterTransform(c.field, "=", c.value))
    );
    const dsId = datasetPipeline.addTransform(rawDSId, tfs);

    // 4. series meta
    seriesMetas.push({
      gridId,
      datasetId: dsId,
      axisId: undefined,
    });
  }

  return {
    matrix,
    grids,
    xAxisArr,
    yAxisArr,
    seriesMetas,
  };
}
