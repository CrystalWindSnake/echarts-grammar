import { GrammarConfig } from "@/grammar/core/types";
import { genGridId } from "@/grammar/core/id-generator";
import type { DataPipeline } from "@/grammar/pipeline/dataset/pipeline";
import {
  andTransform,
  filterTransform,
} from "@/grammar/pipeline/dataset/transforms";
import { TCollectors } from "@/options-builder/collectors";
import { TDataTable } from "@/options-builder/collectors/dataset-collector";

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

export function buildMatrix(
  collectors: TCollectors,
  dataTable: TDataTable,
  facetConfig: NonNullable<GrammarConfig["facet"]>,
) {
  const { row: facetX, col: facetY } = facetConfig;
  const rawMatrix = {} as any;

  if (facetX) {
    rawMatrix.x = {
      data: dataTable.column(facetX, true).map((v) => v.toString()),
      ...DEFAULT_MATRIX_CONFIG.X,
    };
  }
  if (facetY) {
    rawMatrix.y = {
      data: dataTable.column(facetY, true).map((v) => v.toString()),
      ...DEFAULT_MATRIX_CONFIG.Y,
    };
  }

  return collectors.matrix.newRaw({
    ...rawMatrix,
    ...DEFAULT_MATRIX_CONFIG.MATRIX,
  });
}
