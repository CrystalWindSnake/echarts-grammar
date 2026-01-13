import { DatasetSourceWithDim, NormalizedGrammarConfig } from "@/types";
import * as consts from "@/consts";

const m_defaultMatrixConfig = {
  backgroundStyle: {
    borderWidth: 0,
  },
  body: {
    itemStyle: {
      borderWidth: 0,
    },
  },
};

interface TMatrix {
  x: {
    data: string[];
    show: boolean;
    [key: string]: any;
  };
  y: {
    data: string[];
    show: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

export class GrammarToEchartsConverter {
  private series: Record<string, any>[] = [];
  private visualMap: Record<string, any>[] = [];
  public readonly datasetManager: DatasetManager;
  private axesManager: AxesManager;
  private matrix: TMatrix;

  constructor(private config: NormalizedGrammarConfig) {
    this.matrix = this.initMatrix();
    this.axesManager = new AxesManager(this.matrix);
    this.datasetManager = new DatasetManager();
  }

  private initMatrix(): TMatrix {
    const defaultMatrix: TMatrix = {
      ...m_defaultMatrixConfig,
      x: {
        data: [consts.matrix_data_default],
        show: false,
      },
      y: {
        data: [consts.matrix_data_default],
        show: false,
      },
    };

    const { rowValues, columnValues } = this.config.facetInfo || {};

    if (rowValues) {
      defaultMatrix.x.data = rowValues;
    }
    if (columnValues) {
      defaultMatrix.y.data = columnValues;
    }

    return defaultMatrix;
  }

  /**
   * getAxes
   */
  public getAxes(options: {
    rowValue: string | number;
    columnValue: string | number;
  }) {
    return this.axesManager.getAxes(options);
  }

  /**
   * addSeries
   */
  public addSeries(series: Record<string, any>) {
    const seriesId = `series-id-${this.series.length}`;
    this.series.push({ ...series, id: seriesId });
    return seriesId;
  }

  /**
   * addVisualMap
   */
  public addVisualMap(visualMap: Record<string, any>) {
    this.visualMap.push(visualMap);
  }

  public toEChartsOption() {
    const { xAxis, yAxis, grid } = this.axesManager.toEChartsOption();
    const postProcessedMatrix = postProcessMatrixSettings(this.matrix);
    const postProcessedGrid = postProcessGridSettings(
      grid,
      postProcessedMatrix
    );

    return {
      xAxis: xAxis,
      yAxis: yAxis,
      grid: postProcessedGrid,
      series: this.series,
      visualMap: this.visualMap,
      matrix: postProcessedMatrix,
      dataset: this.datasetManager.toDatasetOption(),
    };
  }
}

class AxesManager {
  private itemMap: Map<string, AxesItem>;

  constructor(matrix: TMatrix) {
    this.itemMap = this.initItemMap(matrix);
  }

  private initItemMap(matrix: TMatrix) {
    const itemMap = new Map() as Map<string, AxesItem>;

    matrix.x.data.forEach((x) => {
      matrix.y.data.forEach((y) => {
        const key = `${x}-${y}`;
        const axis = new AxesItem({
          gridIdNumber: itemMap.size,
          matrixCoord: [x, y],
        });

        itemMap.set(key, axis);
      });
    });

    return itemMap;
  }

  public getAxes(options: {
    rowValue: string | number;
    columnValue: string | number;
  }) {
    const { rowValue, columnValue } = options;
    const axesItem = this.itemMap.get(`${rowValue}-${columnValue}`);
    if (!axesItem) {
      throw new Error("Invalid facet config");
    }

    return axesItem;
  }

  public toEChartsOption() {
    const axesItems = Array.from(this.itemMap.values());
    const xAxis = axesItems.flatMap((item) => item.xAxis);
    const yAxis = axesItems.flatMap((item) => item.yAxis);
    const grid = axesItems.flatMap((item) => item.grid);

    return {
      xAxis: xAxis.length > 0 ? xAxis : undefined,
      yAxis: yAxis.length > 0 ? yAxis : undefined,
      grid,
    };
  }
}

type TAxis = Record<string, any> & { show: boolean; id: string };

export class AxesItem {
  public readonly xAxis: TAxis[] = [];
  private xAxisNamesIndexMap: Map<string, number> = new Map();
  public readonly yAxis: TAxis[] = [];
  private yAxisNamesIndexMap: Map<string, number> = new Map();
  public readonly grid: Record<string, any> = {};
  private gridIdNumber: number;

  constructor(options: {
    gridIdNumber: number;
    matrixCoord: [number | string, number | string];
  }) {
    const { gridIdNumber, matrixCoord } = options;
    this.gridIdNumber = gridIdNumber;
    const gridId = this.genGridId();

    this.grid = {
      id: gridId,
      coord: matrixCoord,
      coordinateSystem: "matrix",
    };
  }

  private genGridId() {
    return `gid-${this.gridIdNumber}`;
  }

  private genXAxisId() {
    return `g-${this.gridIdNumber}-${this.xAxis.length}`;
  }

  private genYAxisId() {
    return `g-${this.gridIdNumber}-${this.yAxis.length}`;
  }

  public getXAxisId() {
    if (this.xAxis.length === 0) throw new Error("No xAxis");

    return `g-${this.gridIdNumber}-${this.xAxis.length - 1}`;
  }

  public getYAxisId() {
    if (this.yAxis.length === 0) throw new Error("No yAxis");
    return `g-${this.gridIdNumber}-${this.yAxis.length - 1}`;
  }

  public fillXAxisConfig(options: {
    config: Record<string, any>;
    xName: string;
  }) {
    if (this.xAxis.length > 2) {
      throw new Error("Too many xAxis");
    }

    const { config, xName } = options;

    const index = this.xAxisNamesIndexMap.get(xName);

    if (index !== undefined) {
      const axis = this.xAxis[index];
      Object.assign(axis, {
        ...axis,
        ...config,
      });

      return axis.id;
    }

    const id = this.genXAxisId();
    this.xAxis.push({
      ...config,
      id,
      gridId: this.grid.id,
      show: true,
    });

    this.xAxisNamesIndexMap.set(xName, this.xAxis.length - 1);

    return id;
  }

  public fillYAxisConfig(options: {
    config: Record<string, any>;
    yName: string;
  }) {
    if (this.yAxis.length > 2) {
      throw new Error("Too many yAxis");
    }

    const { config, yName } = options;

    const index = this.yAxisNamesIndexMap.get(yName);

    if (index !== undefined) {
      const axis = this.yAxis[index];
      Object.assign(axis, {
        ...axis,
        ...config,
      });

      return axis.id;
    }

    const id = this.genYAxisId();
    this.yAxis.push({
      ...config,
      id,
      gridId: this.grid.id,
      show: true,
    });

    this.yAxisNamesIndexMap.set(yName, this.yAxis.length - 1);

    return id;
  }
}

type TDatasetFilter = { dim: string; op?: string; value: string | number };
type TDatasetId = string;
type TDatasetWithFilterId = string;

class DatasetManager {
  private dataset: Record<string, any>[] = [];
  private datasetMap: Map<DatasetSourceWithDim, TDatasetId> = new Map();
  private datasetWithFilterSet: Set<TDatasetWithFilterId> = new Set();

  /**
   * getDatasetId
   */
  public getDatasetId(options: {
    data: DatasetSourceWithDim;
    filters: TDatasetFilter[];
  }) {
    const { data: dataset, filters } = options;

    let datasetId = this.datasetMap.get(dataset);

    if (!datasetId) {
      datasetId = this.genDataset(dataset);
    }

    if (filters.length === 0) {
      return datasetId;
    }

    const withFilterKey = this.genWithFilterKey(datasetId, filters);
    if (this.datasetWithFilterSet.has(withFilterKey)) {
      return withFilterKey;
    }

    this.datasetWithFilterSet.add(withFilterKey);

    this.dataset.push({
      id: withFilterKey,
      fromDatasetId: datasetId,
      transform: {
        type: "filter",
        config: {
          and: filters.map((f) => ({
            dimension: f.dim,
            [defaultFilterOp(f.op)]: f.value,
          })),
        },
      },
    });

    return withFilterKey;
  }

  public toDatasetOption() {
    return this.dataset;
  }

  private genDataset(dataset: DatasetSourceWithDim) {
    const id = `ds${this.dataset.length}`;
    this.datasetMap.set(dataset, id);
    this.dataset.push({
      id,
      dimensions: dataset.dimensions,
      source: dataset.source,
    });
    return id;
  }

  private genWithFilterKey(datasetId: TDatasetId, filters: TDatasetFilter[]) {
    const filterKeys = filters
      .map((f) => `${f.dim}-${defaultFilterOp(f.op)}-${f.value}`)
      .join("-");
    return `${datasetId}-${filterKeys}`;
  }
}

function defaultFilterOp(op: string | undefined) {
  return op ?? "=";
}

function postProcessMatrixSettings(matrix: TMatrix): TMatrix | undefined {
  const hasXMatrix = matrix.x.data[0] !== consts.matrix_data_default;
  const hasYMatrix = matrix.y.data[0] !== consts.matrix_data_default;

  if (!hasXMatrix && !hasYMatrix) {
    return undefined;
  }

  return {
    backgroundStyle: {
      borderWidth: 0,
    },
    body: {
      itemStyle: {
        borderWidth: 0,
      },
    },
    x: {
      ...matrix.x,
      show: matrix.x.data[0] !== consts.matrix_data_default,
      levelSize: 30,
      itemStyle: {
        borderWidth: 0,
      },
    },
    y: {
      ...matrix.y,
      show: matrix.y.data[0] !== consts.matrix_data_default,
      levelSize: 30,
      itemStyle: {
        borderWidth: 0,
      },
    },
  };
}

function postProcessGridSettings(
  grid: Record<string, any>[],
  matrix: TMatrix | undefined
): Record<string, any>[] {
  if (matrix === undefined) {
    const { coord, coordinateSystem, ...rest } = grid[0];
    void coord;
    void coordinateSystem;
    return [rest];
  }

  return grid;
}
