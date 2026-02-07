import { CollectorBase } from "../core/collector-base";
import { DatasetTransform } from "@/options-builder/builders/types";

type Dimension = { name: string; type?: string };
type DataSource = {
  dimensions: Dimension[];
  source: any[][];
};

export interface DatasetConfig {
  dimensions?: DataSource["dimensions"];
  source?: DataSource["source"];
  transform?: DatasetTransform;
  fromDatasetId?: string;
}

type OutputDatasetConfig = DatasetConfig & { id: string };

export type DatasetPostProcess = (table: DataTable) => DataTable;

type TransformMeta = {
  fromDatasetId: string;
  postProcess: DatasetPostProcess;
};

export class DatasetCollector extends CollectorBase<DatasetConfig> {
  // key = datasetId
  private transformMeta = new Map<string, TransformMeta>();

  constructor() {
    super("dataset");
  }

  newFromSource(source: any[][]) {
    const first = source[0];
    const rest = source.slice(1);

    const dimensions = first.map((value) => ({
      name: value,
    }));

    return this.create(
      { dimensions, source: rest },
      (existing) => existing.source === rest,
    );
  }

  newFromTransform(
    sourceDatasetId: string,
    transform: DatasetConfig["transform"],
    postProcess?: DatasetPostProcess,
  ) {
    const result = this.create(
      {
        fromDatasetId: sourceDatasetId,
        transform,
      },
      (existing) =>
        existing.fromDatasetId === sourceDatasetId &&
        JSON.stringify(existing.transform) === JSON.stringify(transform),
    );

    if (postProcess) {
      this.transformMeta.set(result.id, {
        fromDatasetId: sourceDatasetId,
        postProcess,
      });
    }
    return result;
  }

  /**
   * 直接返回最终数据：source + pipeline(postProcess)
   */
  getResolvedData(id: string): DataTable {
    const { finalSourceDatasetId, postProcessPipeline } =
      this.resolveDatasetPipeline(id);

    const sourceDs = this.getDataset(finalSourceDatasetId);

    if (!sourceDs.source) {
      throw new Error(
        `Final source dataset ${finalSourceDatasetId} has no source`,
      );
    }

    let rows = new DataTable({
      dimensions: sourceDs.dimensions!,
      source: sourceDs.source,
    });

    for (const fn of postProcessPipeline) {
      rows = fn(rows);
    }

    return rows;
  }

  /**
   * 新增：
   * 返回 pipeline 信息：
   * - finalSourceDatasetId：最终 source 的 datasetId
   * - postProcessPipeline：从 source -> ... -> id 的 postProcess 列表（按执行顺序）
   */
  resolveDatasetPipeline(id: string): {
    finalSourceDatasetId: string;
    postProcessPipeline: DatasetPostProcess[];
  } {
    const visited = new Set<string>();
    const pipeline: DatasetPostProcess[] = [];

    let currentId = id;

    while (true) {
      if (visited.has(currentId)) {
        throw new Error(
          `Dataset cycle detected: ${Array.from(visited).join(" -> ")} -> ${currentId}`,
        );
      }
      visited.add(currentId);

      const ds = this.getDataset(currentId);

      // 如果当前节点有 postProcess，则说明 currentId 是一个 transform 产物
      // 它的 postProcess 应该在 “它的 source 之后执行”
      const meta = this.transformMeta.get(currentId);
      if (meta?.postProcess) {
        // 注意：我们是从 target 往 source 走，所以先 push，最后再 reverse
        pipeline.push(meta.postProcess);
      }

      if (ds.source) {
        // 走到了最终 source
        pipeline.reverse();
        return {
          finalSourceDatasetId: currentId,
          postProcessPipeline: pipeline,
        };
      }

      if (!ds.fromDatasetId) {
        throw new Error(
          `Dataset ${currentId} has no source and no fromDatasetId`,
        );
      }

      currentId = ds.fromDatasetId;
    }
  }

  getDataset(id: string) {
    const item = this.items.find((i) => i.id === id);
    if (!item) {
      throw new Error(`Dataset ${id} not found`);
    }
    return item.config as OutputDatasetConfig;
  }

  newRaw(config: DatasetConfig) {
    return this.create(config);
  }

  exportDatasets() {
    return this.export();
  }
}

/* ---------------------------
 * DataTable
 * --------------------------- */
type RowObject = Record<string, any>;

class DataTable {
  private readonly _dimensions: Dimension[];
  private readonly _source: any[][];

  private readonly _nameToIndex: Map<string, number>;

  constructor(data: DataSource) {
    this._dimensions = data.dimensions.map((d) => ({ ...d }));
    this._source = data.source.map((row) => [...row]);

    this._nameToIndex = new Map();
    this._dimensions.forEach((d, i) => {
      this._nameToIndex.set(d.name, i);
    });
  }

  /* ---------------------------
   * getters
   * --------------------------- */

  get dimensions(): ReadonlyArray<Dimension> {
    return this._dimensions;
  }

  get source(): ReadonlyArray<ReadonlyArray<any>> {
    return this._source;
  }

  get rowCount(): number {
    return this._source.length;
  }

  get columnCount(): number {
    return this._dimensions.length;
  }

  get columnNames(): string[] {
    return this._dimensions.map((d) => d.name);
  }

  /* ---------------------------
   * 核心：列名 -> index
   * --------------------------- */

  hasColumn(name: string): boolean {
    return this._nameToIndex.has(name);
  }

  colIndex(name: string): number {
    const idx = this._nameToIndex.get(name);
    if (idx == null) {
      throw new Error(
        `[DataTable] Column "${name}" not found. Available: ${this.columnNames.join(
          ", ",
        )}`,
      );
    }
    return idx;
  }

  /* ---------------------------
   * 常用操作
   * --------------------------- */

  /**
   * 获取一整行（按列名组织成对象）
   */
  private rowObject(rowIndex: number): RowObject {
    const row = this._source[rowIndex];
    const obj: RowObject = {};
    for (let i = 0; i < this._dimensions.length; i++) {
      obj[this._dimensions[i].name] = row[i];
    }
    return obj;
  }

  /**
   * 指定列名，获取该列的所有值
   */
  column<T = any>(name: string, distinct: boolean = false): T[] {
    const idx = this.colIndex(name);

    if (distinct) {
      const seen = new Set<T>();
      return this._source
        .map((row) => row[idx])
        .filter((value) => {
          if (seen.has(value)) {
            return false;
          }
          seen.add(value);
          return true;
        }) as T[];
    }

    return this._source.map((row) => row[idx]) as T[];
  }

  /**
   * 指定列名，返回该列的可迭代对象（惰性迭代）
   */
  *iterColumn<T = any>(
    name: string,
    distinct: boolean = false,
  ): IterableIterator<T> {
    const idx = this.colIndex(name);

    if (distinct) {
      const seen = new Set<T>();
      for (const row of this._source) {
        const value = row[idx] as T;
        if (!seen.has(value)) {
          seen.add(value);
          yield value;
        }
      }
    } else {
      for (const row of this._source) {
        yield row[idx] as T;
      }
    }
  }

  /**
   * 过滤行（predicate 参数是 rowObject）
   */
  filterRows(
    predicate: (row: RowObject, rowIndex: number) => boolean,
  ): DataTable {
    const newSource: any[][] = [];

    for (let i = 0; i < this._source.length; i++) {
      const obj = this.rowObject(i);
      if (predicate(obj, i)) {
        newSource.push([...this._source[i]]);
      }
    }

    return new DataTable({
      dimensions: this._dimensions,
      source: newSource,
    });
  }

  /**
   * 选择列（返回新 DataTable）
   */
  selectColumns(names: string[]): DataTable {
    const indices = names.map((n) => this.colIndex(n));

    const newDimensions = indices.map((i) => ({ ...this._dimensions[i] }));
    const newSource = this._source.map((row) => indices.map((i) => row[i]));

    return new DataTable({
      dimensions: newDimensions,
      source: newSource,
    });
  }
}
