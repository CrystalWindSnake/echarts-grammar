import { TCollectors } from "@/options-builder/collectors";

const DEFAULT_GRID_CONFIG = {
  left: "left",
  top: "top",
  bottom: 0,
  right: 0,

  outerBounds: {
    left: 5,
    top: 20,
    right: 20,
    bottom: 20,
  },
};

export function buildGrid(options: {
  collectors: TCollectors;
  matrixId: string;
  row: any;
  col: any;
}) {
  const { collectors, matrixId, row, col } = options;

  return collectors.grids.newGridFromMatrix(
    {
      id: matrixId,
      xValue: row.toString(),
      yValue: col.toString(),
    },
    {
      ...DEFAULT_GRID_CONFIG,
    },
  );
}
