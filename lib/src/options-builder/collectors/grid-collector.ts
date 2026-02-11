import { CollectorWithIdBase } from "../core/collector-base";
import { ReusePredicate } from "../core/types";

export interface GridConfig {
  id?: string;
  [key: string]: unknown;
}

type GridWithMatrix = GridConfig & {
  coordinateSystem: "matrix";
  coord: [unknown, unknown];
};

export class GridCollector extends CollectorWithIdBase<GridConfig> {
  constructor() {
    super("grid");
  }

  newGrid(config: GridConfig = {}) {
    return this.create(config);
  }

  newGridFromMatrix(
    matrix: {
      id: string;
      xValue?: unknown;
      yValue?: unknown;
    },
    config: GridConfig = {},
  ) {
    const { xValue = "-1", yValue = "-1" } = matrix;

    const reuse = (e: GridConfig) => {
      const config = e as GridWithMatrix;
      if (!config.coordinateSystem || config.coordinateSystem !== "matrix")
        return false;
      const [x, y] = config.coord;
      return x === xValue && y === yValue;
    };

    return this.create(
      {
        ...config,
        coordinateSystem: "matrix",
        coord: [xValue, yValue],
        matrixId: matrix.id,
      },
      reuse,
    );
  }

  newGridWithReuse(config: GridConfig, reuse: ReusePredicate<GridConfig>) {
    return this.create(config, reuse);
  }

  exportGrids() {
    return this.export();
  }
}
